require('dotenv').config();

const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const https = require('https');
const fs = require('fs');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');

const app = express();
const port = 5000;
const limit = 1000;

const secretKey = 'unidish-key';

const jsonParser = bodyParser.json()

const tableName = "readings_tent";

const corsOptions = {
    origin: ['https://connect.weiss.land', 'http://localhost:3000'],
    optionsSuccessStatus: 200
}

// Enable CORS
app.use(cors(corsOptions));

// MySQL Connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

// New MySQL Connection for Unidish
const unidishDb = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.UNIDISH_DB_USER,
    password: process.env.UNIDISH_DB_PASSWORD,
    database: process.env.UNIDISH_DB_DATABASE
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to the database');
  });
  
// Connect to Unidish database
unidishDb.connect((err) => {
    if (err) throw err;
    console.log('Connected to the Unidish database ooooooo');
});

app.get('/api/unidish', (req, res) => {
    console.log('Received request for /api/unidish');
    const { table } = req.query;
    let query = '';

    if (table == 'all') {
        query = 'SELECT * FROM COMMENT, COMMENT_DISLIKES, COMMENT_LIKES, DINING_HALL, MENU_ITEM, RESTAURANT, REVIEW, REVIEW_DISLIKES, REVIEW_LIKES, USER;'
    }
    else {
        query = 'SELECT * FROM ' + table + ';';
    }

    unidishDb.query(query, (err, results) => {
        if (err) throw err;
        res.json(results);
    })
});

app.post('/api/unidish/addUser', jsonParser, async (req, res) => {
    console.log("Received request addUser Request:", req.body);
    // console.log('Received signup and add user Request for /api/unidish/addUser');

    const data = req.body; // Assuming the request body contains userData
    const { firstname, lastname, email, username, password, confirmPassword } = data;

    if (password !== confirmPassword) {
        console.log("Password mismatch error:");
        res.status(400).json({ error: 'Passwords do not match' });
        return;
    }

    try {
        unidishDb.query("SELECT COUNT(*) FROM USER WHERE email = ?", [email], (err, results) => {
            if (err) throw err;
            if (results[0]['COUNT(*)']) {
                console.log("Duplicate email error:");
                res.status(400).json({ error: 'User with this email already exists' });
                return;
            }
        });
        console.log("Unique email");

        unidishDb.query("SELECT COUNT(*) FROM USER WHERE username = ?", [username], (err, results) => {
            if (err) throw err;
            if (results[0]['COUNT(*)']) {
                console.log("Duplicate username error:");
                res.status(400).json({ error: 'User with this username already exists' });
                return;
            }
        });
        console.log("Unique username");

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        console.log("Inserting");

        const insertQuery = `
        INSERT INTO USER (Username, Email, Password, Type, Profile_Description, FName, LName)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        `;

        unidishDb.query(insertQuery, [username, email, hashedPassword, 1, 'Default Description', firstname, lastname], (err, results) => {
        if (err) {
            console.error("Error:", err);
            res.status(400).json({ error: 'Failed to add user' });
            return;
        }
        console.log("Successful add:");
        res.status(200).json({ error: 'User added successfully' });
        });


    } catch (err) {
        console.error(err);
        console.log("Server error:");
        res.status(500).json({ error: 'Server Error' });
    }
});

app.post('/api/unidish/login', jsonParser, async (req, res) => {
    console.log("Received request login Request:", req.body);

    // const { loginPayload } = req.body;  // Extract loginPayload from request body
    const { email, password } = req.body;  // Extract email and password from loginPayload
    
    const query = "SELECT * FROM USER WHERE email = ?";
    
    unidishDb.query(query, [email], async (err, results) => {
      if (err) {
        console.error("Database error:", err);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }
      
      const dbUser = results[0];
      
      if (!dbUser) {
        console.log("Can't find email;")
        res.status(401).json({ error: 'No account with this email' });
        return;
      }
      
      console.log("Checking passwords");
      const isPasswordCorrect = await bcrypt.compare(password, dbUser.Password);  // Adjust the field name based on your database
      
      if (isPasswordCorrect) {
        console.log("Password is correct");
        const payload = {
          email: dbUser.Email,  // Adjust the field names based on your database
          id: dbUser.User_ID,
          firstname: dbUser.FName,
          lastname: dbUser.LName,
          username: dbUser.Username,
          type: dbUser.Type,
          profile_description: dbUser.Profile_Description
        };
        
        const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });  // Replace 'your-secret-key' with your actual secret key
        console.log("Signed token returning...");
        res.status(200).json({ error: 'Success', token: 'Bearer ' + token });
        return;
      }
      console.log("Wrong password.");
      res.status(400).json({ error: 'Wrong Password' });
    });
});

app.get('/api/unidish/getUserByToken', async (req, res) => {
    console.log("Received request getUserByToken Request:", req.headers['authorization']);
    const authHeader = req.headers.authorization;
    console.log('AuthHeader:', authHeader);
  
    if (!authHeader) {
        console.log("Missing Auth Header");
      res.status(401).json({ message: "Missing Authorization Header" });
      return;
    }
  
    try {
      // The header format is "Bearer TOKEN", so split by space and get the token
      const token = authHeader.split(" ")[1];
      console.log("Verifying token");
      const decodedToken = jwt.verify(token, secretKey, { algorithms: ["HS256"] });  // Replace 'your-secret-key' with your actual secret key
        console.log("Correct token");
      res.status(200).json({ isLoggedIn: true, user: decodedToken });
    } catch (error) {
      if (error instanceof jwt.ExpiredSignatureError) {
        console.log("Expired token");
        res.status(401).json({ error: "Token has expired" });
      } else if (error instanceof jwt.JsonWebTokenError) {
        console.log("Invalid token");
        res.status(401).json({ error: "Invalid token" });
      } else {
        console.log("Server error");
        res.status(500).json({ error: String(error) });
      }
    }
  });

  // app.get('/api/unidish/getDiningHallsWithRestaurantsAndReviews', async (req, res) => {
  //   try {
  //     unidishDb.query("SELECT * FROM DINING_HALL", async (err, dining_halls) => {
  //       if (err) throw err;
            
  //           let result = [];
  //           console.log("Getting restaurants from each dining hall:");
  //           for (const dining_hall of dining_halls) {
  //               const Dining_Hall_ID = dining_hall.Dining_Hall_ID; // Change these to your actual column names
  //               const Name = dining_hall.Name;
  //               const Address = dining_hall.Address;
  //               const Overall_Rating = dining_hall.Overall_Rating;
  //               const Description = dining_hall.Description;
  //               let restaurants;
  //               try {
  //                 const rows = await queryAsync("SELECT * FROM RESTAURANT WHERE Dining_Hall_ID = ?", [Dining_Hall_ID], unidishDb);
  //                 restaurants = rows;
  //               } catch (e) {
  //                   console.log("error: ");
  //                   console.error(e);
  //                   continue; // Skip this iteration if the query fails
  //               }
  //               console.log("Mapping restaurants list");
  //               let restaurants_list = restaurants.map(r => ({
  //                   'id': r.Restaurant_ID, // Change these to your actual column names
  //                   'name': r.Name,
  //                   'overall_rating': r.Overall_Rating,
  //                   'description': r.Description,
  //                   'menu_name': r.Menu_Name,
  //                   'menu_description': r.Menu_Description,
  //                   'dining_hall_id': r.Dining_Hall_ID
  //               }));

                
  //               for (const restaurant of restaurants_list) { // get reviews
  //                 let reviews;
  //                 try {
  //                   const rows = await queryAsync("SELECT * FROM REVIEW WHERE Restaurant_ID = ?", [restaurant.id], unidishDb);
  //                   reviews = rows;
  //                 } catch (errory) {
  //                   console.log("error: ");
  //                   console.error(e);
  //                   continue;
  //                 }
  //                 console.log("Mapping Reviews list");
  //                 let review_list = reviews.map(re => ({
  //                   'id': re.Review_ID,
  //                   'date': re.Date,
  //                   'rating': re.Rating,
  //                   'description': re.Description,
  //                   'rest_id': re.Restaurant_ID,
  //                   'user_id': re.User_ID
  //                 }))
  //                 result.push({
  //                   'dining_hall': dining_hall,
  //                   'restaurants': restaurants_list,
  //                   'reviews': review_list
  //                 });
  //             }
                
  //           }
            
  //           res.json({ 'dining_halls': result });
  //     });
  //   } catch (error) {

  //   }
  // });

  app.get('/api/unidish/getDiningHallsWithRestaurants', async (req, res) => {
    try {
        unidishDb.query("SELECT * FROM DINING_HALL", async (err, dining_halls) => {
            if (err) throw err;
            
            let result = [];
            console.log("Getting restaurants from each dining hall:");
            for (const dining_hall of dining_halls) {
                const Dining_Hall_ID = dining_hall.Dining_Hall_ID; // Change these to your actual column names
                const Name = dining_hall.Name;
                const Address = dining_hall.Address;
                const Overall_Rating = dining_hall.Overall_Rating;
                const Description = dining_hall.Description;

                let restaurants;
                
                try {
                  const rows = await queryAsync("SELECT * FROM RESTAURANT WHERE Dining_Hall_ID = ?", [Dining_Hall_ID], unidishDb);
                  restaurants = rows;
                } catch (e) {
                    console.log("error: ");
                    console.error(e);
                    continue; // Skip this iteration if the query fails
                }
                console.log("Mapping restaurants list");
                let restaurants_list = restaurants.map(r => ({
                    'id': r.Restaurant_ID, // Change these to your actual column names
                    'name': r.Name,
                    'overall_rating': r.Overall_Rating,
                    'description': r.Description,
                    'menu_name': r.Menu_Name,
                    'menu_description': r.Menu_Description,
                    'dining_hall_id': r.Dining_Hall_ID
                }));

                result.push({
                    'dining_hall': dining_hall,
                    'restaurants': restaurants_list
                });
            }
            
            res.json({ 'dining_halls': result });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'An error occurred' });
    }
});


app.get('/api/unidish/getRestaurantById', jsonParser, async (req, res) => {
  try {
    const restId = req.query.restId;
    console.log("Got request for restaurant with ID:"+restId);

    unidishDb.query("SELECT * FROM RESTAURANT WHERE Restaurant_ID = ?", [restId], (err, results) => {
      if (err) {
        console.log("Couldn't find a restaurant");
        throw err;
      }
      const restaurant = results[0];
      res.status(200).json({'restaurant': restaurant});
    })

  } catch (error) {
    // console.log(error);
    console.log("System Error:", error);
    res.status(500).json({error: error.toString()});
  }
});

app.get('/api/unidish/getMenuItemsForRestaurant', jsonParser, async (req, res) => {
  try {
    const restId = req.query.restId; // Use req.query to access GET parameters
    console.log("Got request for menu items from restaurant with ID: " + restId);

    unidishDb.query("SELECT * FROM MENU_ITEM WHERE Restaurant_ID = ?", [restId], (err, results) => {
      if (err) {
        console.log("Couldn't find something or another");
        throw err;
      }

      const menuItems = results; // fetchAll equivalent
      res.status(200).json({ 'menu_items': menuItems });
    });

  } catch (error) {
    console.log("System Error:",error);
    res.status(500).json({ error: error.toString() });
  }
});

app.post('/api/unidish/changePassword', jsonParser, async (req, res) => {
  console.log("Received change password request", req.body);
  try {
    const { token, oldPassword, newPassword } = req.body;
    const fixedToken = token.split(" ")[1];
    const user = jwt.verify(fixedToken, secretKey); // Verify and decode the token
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt); // Hash the new password

    const userQuery = "SELECT * FROM USER WHERE User_ID = ?";
    unidishDb.query(userQuery, [user.id], async (err, results) => {
      if (err) {
        console.error("Database error during password change:", err);
        res.status(500).json({ success: false, error: "Internal Server Error" });
        return;
      }

      const dbUser = results[0];
      if (!dbUser) {
          res.status(401).json({ success: false, error: "User not found." });
          return;
      }

      // Compare the provided old password with the stored hash
      const isOldPasswordCorrect = await bcrypt.compare(oldPassword, dbUser.Password);
      if (!isOldPasswordCorrect) {
          res.status(401).json({ success: false, error: "Incorrect old password." });
          return;
      }

      // const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);
      const updateQuery = 'UPDATE USER SET Password = ? WHERE User_ID = ?';
      unidishDb.query(updateQuery, [hashedPassword, user.id], (updateErr, updateResult) => {
          if (updateErr) {
              console.error("Database error during password update:", updateErr);
              res.status(500).json({ success: false, error: "Internal Server Error" });
              return;
          }

          if (updateResult.affectedRows) {
              res.json({ success: true, message: 'Password changed successfully.' });
          } else {
              res.status(400).json({ success: false, error: 'Password update failed.' });
          }
        });
      });
    } catch (error) {
      console.error("Failed to change password: ", error);
      res.status(500).send({ success: false, error: 'Server error.' });
  }
});

app.post('/api/unidish/deleteAccount', jsonParser, async (req, res) => {
  console.log("Received delete account request", req.body);
  try {
    const { token} = req.body;
    const fixedToken = token.split(" ")[1];
    const user = jwt.verify(fixedToken, secretKey); // Verify and decode the token
    const deleteQuery = "DELETE FROM USER WHERE User_ID = ?";
    unidishDb.query(deleteQuery, [user.id], async (err, results) => {
      if (err) {
        console.error("Database error during account deletion:", err);
        res.status(500).json({ success: false, error: "Internal Server Error" });
        return;
      }
      if (results.affectedRows === 0) {
        res.status(404).json({ success: false, error: "User not found." });
        return;
      }
      res.status(200).json({ success: true, message: 'Account successfully deleted' });
    });

  } catch (error) {
    console.error("Failed to delete account", error);
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ success: false, error: 'Invalid token' });
    } else {
      res.status(400).json({ success: false, error: 'Failed to delete account due to server error' });
    }
  }
});

app.post('/api/unidish/editProfile', jsonParser, async(req, res) => {
  console.log("Received edit profile request", req.body);
  try {
    const { token: tokenObject, username: userN, firstname: Fname, lastname: Lname, profile_description: p_d, type: t } = req.body;
    console.log(tokenObject);
    const { username, firstname, lastname, profile_description, type} = tokenObject;
    const fixedToken = tokenObject.token.split(" ")[1];
    const user = jwt.verify(fixedToken, secretKey); // Verify and decode the token

    const updateQuery = `
      UPDATE USER 
      SET Username = ?, 
          FName = ?, 
          LName = ?, 
          Profile_Description = ?, 
          Type = ? 
      WHERE User_ID = ?`;
    console.log(username, firstname, lastname, profile_description, type, user.id);
    unidishDb.query(updateQuery, [username, firstname, lastname, profile_description, type, user.id], 
      (err, results) => {
        if (err) {
          console.error("Database error during profile update:", err);
          res.status(500).json({ success: false, error: "Internal Server Error" });
          return;
        }
        
        if (results.affectedRows) {
          res.json({ success: true, message: 'Profile updated successfully.' });
        } else {
          res.status(400).json({ success: false, error: 'Profile update failed.' });
        }
    });
  } catch (error) {
    console.error("Failed to update profile: ", error);
    res.status(500).send({ success: false, error: 'Server error.' });
  }
});

// Define the endpoint
app.get('/api/data', (req, res) => {
    const { topic } = req.query;
    let query = '';

    // Assign the query based on the mqttTopic
    if (topic == 'co2') {
        query = 'SELECT * FROM (SELECT id, date, carbon_dioxide AS value FROM ' + tableName + ' order by id desc LIMIT ' + limit + ') AS subquery ORDER BY subquery.id ASC';
    } else if (topic == 'temp') {
        query = 'SELECT * FROM (SELECT id, date, temperature AS value FROM ' + tableName + ' order by id desc LIMIT ' + limit + ') AS subquery ORDER BY subquery.id ASC';
    } else if (topic == 'hum') {
        query = 'SELECT * FROM (SELECT id, date, humidity AS value FROM ' + tableName + ' order by id desc LIMIT ' + limit + ') AS subquery ORDER BY subquery.id ASC';
    } else if (topic == 'light') {
        query = 'SELECT * FROM (SELECT id, date, light AS value FROM ' + tableName + ' order by id desc LIMIT ' + limit + ') AS subquery ORDER BY subquery.id ASC';
    } else {
        res.status(400).json({ error: 'Invalid topic' });
        return;
    }
    console.log("Executing query for " + topic + " and returning")
    // Execute the query and return the results
    db.query(query, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});


function queryAsync(sql, args, connection) {
  return new Promise((resolve, reject) => {
      connection.query(sql, args, (err, rows) => {
          if (err) return reject(err);
          resolve(rows);
      });
  });
}

app.get('/api/data/text', (req, res) => {
  const { filename } = req.query;
  let query = 'SELECT content FROM text_files WHERE filename = ?';

  // Execute the query and return the results
  db.query(query, [filename], (err, results) => {
      if (err) {
          console.error(err);
          return res.status(500).json({ message: 'Error fetching the text content' });
      }
      // Check if a file with that name exists
      if (results.length === 0) {
          return res.status(404).json({ message: 'File not found' });
      }
      res.json({ content: results[0].content });
  });
});

// Define the endpoint to post changes to a text file
app.post('/api/data/text', jsonParser, (req, res) => {
  const { filename, content } = req.body;
  let queryFind = 'SELECT id FROM text_files WHERE filename = ?';
  let queryUpdate = 'UPDATE text_files SET content = ? WHERE filename = ?';
  let queryInsert = 'INSERT INTO text_files (filename, content) VALUES (?, ?)';

  // Check if the file exists, then update, or else insert a new file
  db.query(queryFind, [filename], (err, results) => {
      if (err) {
          console.error(err);
          return res.status(500).json({ message: 'Error checking the text file' });
      }
      if (results.length > 0) {
          // File exists, update content
          db.query(queryUpdate, [content, filename], (err, results) => {
              if (err) {
                  console.error(err);
                  return res.status(500).json({ message: 'Error updating the text content' });
              }
              res.json({ message: 'File updated successfully' });
          });
      } else {
          // File does not exist, insert new content
          db.query(queryInsert, [filename, content], (err, results) => {
              if (err) {
                  console.error(err);
                  return res.status(500).json({ message: 'Error creating the text file' });
              }
              res.status(201).json({ message: 'File created successfully' });
          });
      }
  });
});


app.listen(port, () => {
console.log(`Server running on port ${port}`);
});
