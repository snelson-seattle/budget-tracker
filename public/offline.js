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
        checkDatabase();
    }
};

request.onerror = (event) => {
    console.log("Oops! We're Sorry, but " + event.target.errorCode);
};

const saveRecord = (record) => {
    // Open a transaction on the pending object store in the budget db with readwrite access
    const transaction = db.transaction(["pending"], "readwrite");

    // Access the pending object store
    const store = transaction.objectStore("pending");

    // Add a record to the store with add method
    store.add(record);
};

const checkDatabase = () => {
    // Open a transaction on the pending object store in the budget db with readwrite access
    const transaction = db.transaction(["pending"], "readwrite");

    // Access the pending object store
    const store = transaction.objectStore("pending");

    // Get all the records from the store
    const getAll = store.getAll();

    getAll.onsuccess = () => {
        if(getAll.result.length > 0) {
            fetch("/api/transaction/bulk", {
                method: "POST",
                body: JSON.stringify(getAll, result),
                headers: {
                    Accept: "application/json, text/plain, */*",
                    "Content-Type": "application/json"
                }
            }).then(response => response.json()).then(() => {
                // If successful, open a transaction on the pending db
                const transaction = db.transaction(["pending"], "readwrite");

                // Access the pending object store
                const store = transaction.objectStore("pending");

                // Clear all the store items
                store.clear();
            });
        }
    };
}


// Listen for app to come back online
window.addEventListener("online", checkDatabase);

