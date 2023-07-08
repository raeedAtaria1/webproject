const express = require('express');
const admin = require('firebase-admin');
const path = require('path');
const React = require('react');
const ReactDOM = require('react-dom');
const cors = require('cors');

const app = express();
const port = 8000;
app.use(cors());
// Initialize Firebase Admin SDK
const serviceAccount = require('./webapp-44c6b-firebase-adminsdk-8yipf-f80df382a8.json'); // Path to your service account key JSON file
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://webapp-44c6b-default-rtdb.europe-west1.firebasedatabase.app/' // Replace with your Firebase project's URL
});

// Route to serve the TaskManagement component
// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '..', 'frontEnd')));
//change
app.get('/', (req, res) => {
  
  // res.sendFile(path.join(__dirname, '../frontEnd/logIN.html'));
  res.setHeader("Access-Control-Allow-Credentials", "true");

});
//the sigh-up function 
app.post('/signup', async (req, res) => {
  const { email, fullName, password, role, adminEmail } = req.body;
  try {
    // Check if the user already exists
    const usersRef = admin.firestore().collection('users');
    const querySnapshot = await usersRef.where('email', '==', email).get();

    if (!querySnapshot.empty) {
      res.status(400).send('User already exists');
      return;
    }
    // Check if the admin email exists
    if (adminEmail) {
      const adminQuerySnapshot = await usersRef.where('email', '==', adminEmail).get();
      if (adminQuerySnapshot.empty) {
        res.status(400).send('Admin email does not exist');
        return;
      }
    }

    // Create a new user document in Firestore
    const newUser = {
      email,
      fullName,
      password,
      role,
      adminEmail
    };
    const newUserRef = await usersRef.add(newUser);

    // Redirect to userhomepage.html or any other page you want
    res.sendFile(path.join(__dirname, '../frontEnd/userhomepage.html'));
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});



// Update task status
app.put('/tasks/:id/status', async (req, res) => {
  try {
    const taskId = req.params.id;
    const { status } = req.body;
    const userEmail = req.headers.email;

    // Check if the task belongs to the user
    const taskRef = admin.firestore().collection('tasks').doc(taskId);
    const taskDoc = await taskRef.get();
    const taskData = taskDoc.data();

    if (!taskData || taskData.userEmail !== userEmail) {
      return res.status(404).send('Task not found');
    }

    // Update the task status
    await taskRef.update({ status });

    // Send a success response
    res.status(200).send('Task status updated successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});
//get the workers
app.post('/getWorkers', async (req, res) => {
  const { adminEmail } = req.body;

  try {
    // Retrieve the user document from Firestore based on the email
    const usersRef = admin.firestore().collection('users');
    const querySnapshot = await usersRef.where('adminEmail', '==', adminEmail).get();

    if (querySnapshot.empty) {
      res.status(400).send('There are no employees.');
      return;
    }

    const workersEmail = [];
    querySnapshot.forEach(doc => {
      const workerEmail = doc.data();
      workerEmail.id = doc.id;
      workersEmail.push(workerEmail);
    });

    res.json(workersEmail);
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

//the login function 
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Retrieve the user document from Firestore based on the email
    const usersRef = admin.firestore().collection('users');
    const querySnapshot = await usersRef.where('email', '==', email).get();

    if (querySnapshot.empty) {
      res.status(400).send('Invalid email or password');
      return;
    }

    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();

    if (userData.password !== password) {
      res.status(400).send('Invalid email or password');
      return;
    }
  // Send the user role and the adminEmail to the client
  res.status(200).send({ role: userData.role, adminEmail: userData.adminEmail });
  // Redirect to userhomepage.html
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});
// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

//add Task
app.post('/addTask', async (req, res) => {
  const { formattedDateTime, taskDescription, dueDate, taskName, userEmail,status,adminEmail } = req.body;
  const db = admin.firestore();
  const taskData = {
    createdAt: formattedDateTime,
    description: taskDescription,
    dueDate: dueDate,
    name: taskName,
    userEmail: userEmail,
    status:status,
    adminEmail:adminEmail
  };
  try {
    const newTaskRef = await db.collection('tasks').add(taskData);
    res.status(200).send(`Task added successfully with ID: ${newTaskRef.id}`);

  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});



// get tasks
app.get('/tasks', async (req, res) => {
  try {
    const userEmail = req.headers.email;
    const tasksRef = admin.firestore().collection('tasks');
    const querySnapshot = await tasksRef.where('userEmail', '==', userEmail).get();
    const tasks = [];
    querySnapshot.forEach(doc => {
      const task = doc.data();
      task.id = doc.id;
      tasks.push(task);
    });
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});
// get tasks
app.get('/tasksAdmin', async (req, res) => {
  try {
    const userEmail = req.headers.email;
    const tasksRef = admin.firestore().collection('tasks');
    const querySnapshot = await tasksRef.where('adminEmail', '==', userEmail).get();
    const tasks = [];
    querySnapshot.forEach(doc => {
      const task = doc.data();
      task.id = doc.id;
      tasks.push(task);
    });
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});
//get the tasks for the manger
app.get('/employessTasks', async (req, res) => {
  try {
    const adminEmail = req.headers.email;
    const tasksRef = admin.firestore().collection('tasks');
    const querySnapshot = await tasksRef.where('adminEmail', '==', adminEmail).get();
    const tasks = [];
    querySnapshot.forEach(doc => {
      const task = doc.data();
      task.id = doc.id;
      tasks.push(task);
    });
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});
// delete tasks
app.delete('/tasks/:id', async (req, res) => {
  try {
    // Retrieve the task's id from the request parameters
    const taskId = req.params.id;
    
    // Delete the task from the database
    const db = admin.firestore();
    await db.collection('tasks').doc(taskId).delete();

    // Send a success response
    res.status(200).send('Task deleted successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});

async function editTask(req, res) {
  try {
    const taskId = req.params.id;
    const tasksRef = admin.firestore().collection('tasks');
    const taskDoc = await tasksRef.doc(taskId).get();
    
    if (!taskDoc.exists) {
      // Send a 404 Not Found if no task with this ID exists
      res.status(404).send('Task not found');
      return;
    }

    const task = taskDoc.data();
    task.id = taskDoc.id;
    res.json(task);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}

app.get('/tasks/:id', editTask);
app.put('/api/tasks/:id', async (req, res) => {
  const taskId = req.params.id;
  const updatedTaskData = req.body;

  try {
    const taskRef = admin.firestore().collection('tasks').doc(taskId);
    await taskRef.update(updatedTaskData);
    res.json({ message: `Task with ID: ${taskId} was updated successfully.` });
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
}
});
