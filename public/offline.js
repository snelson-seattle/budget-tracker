let db;

// create a new request for a "budget" database in indexedDB
const request = indexedDB.open("budget", 1);

request.onupgradeneeded = (event) => {
    // create an object store "pending", and set autoincrement
    const db = event.target.result;
    db.createObjectStore("pending", { autoIncrement: true});
};

request.onsuccess = (event) => {
    db = event.target.result;

    // check if the app is online before reading from the indexedDB
    if(navigator.onLine) {
        // Database checking function goes here
    }
};


