const tableBody = document.getElementById("tableBody");
const contactForm = document.getElementById("contactForm");
const formInputs = document.getElementById("formInputs");
const submitBtn = document.getElementById("submitForm");
let contactsArray = [];
let editingID;

function Contact() {
	this.id = null;
	this.lastName = null;
	this.firstName = null;
	this.emailAddress = null;
	this.contactNumber = null;
}

function handleSubmitBtn(e) {
	e.preventDefault();
	addNewContact();
}

function handleEditBtn(e) {
	e.preventDefault();
	editContact(editingID);
}

function addContactObject(
	id,
	lastName,
	firstName,
	emailAddress,
	contactNumber
) {
	const newContact = new Contact();

	newContact.id = id;
	newContact.lastName = lastName;
	newContact.firstName = firstName;
	newContact.emailAddress = emailAddress;
	newContact.contactNumber = contactNumber;

	contactsArray.push(newContact);

	refreshAllContacts();
}

function insertNewRow(contactObject) {
	console.log(1);
	const newRow = document.createElement("tr");

	const lastNameCell = document.createElement("td");
	lastNameCell.textContent = contactObject.lastName;
	lastNameCell.classList.add("cell");

	const firstNameCell = document.createElement("td");
	firstNameCell.textContent = contactObject.firstName;
	firstNameCell.classList.add("cell");

	const emailAddressCell = document.createElement("td");
	emailAddressCell.textContent = contactObject.emailAddress;
	emailAddressCell.classList.add("cell");

	const contactNumberCell = document.createElement("td");
	contactNumberCell.textContent = contactObject.contactNumber;
	contactNumberCell.classList.add("cell");

	const actionCell = document.createElement("td");
	const editButton = document.createElement("button");
	editButton.textContent = "Edit Contact";
	editButton.onclick = function () {
		showEditContactForm(contactObject);
	};
	actionCell.appendChild(editButton);

	const deleteButton = document.createElement("button");
	deleteButton.textContent = "Delete Button";
	deleteButton.onclick = function () {
		deleteContact(contactObject.id);
	};
	actionCell.appendChild(deleteButton);
	actionCell.classList.add("cell");

	newRow.appendChild(lastNameCell);
	newRow.appendChild(firstNameCell);
	newRow.appendChild(emailAddressCell);
	newRow.appendChild(contactNumberCell);
	newRow.appendChild(actionCell);

	tableBody.appendChild(newRow);
}

function addNewContact() {
	const lastName = document.getElementById("lastName").value;
	const firstName = document.getElementById("firstName").value;
	const emailAddress = document.getElementById("emailAddress").value;
	const contactNumber = document.getElementById("contactNumber").value;

	if (lastName && firstName && emailAddress && contactNumber) {
		var jsonData = JSON.stringify({
			lastName: lastName,
			firstName: firstName,
			emailAddress: emailAddress,
			contactNumber: contactNumber,
		});

		var xhr = new XMLHttpRequest();
		xhr.open("POST", "insert.php", true);
		xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

		xhr.onreadystatechange = function () {
			if (xhr.readyState === 4 && xhr.status === 200) {
				console.log(xhr.responseText);
			}
		};

		xhr.send(jsonData);

		document.getElementById("result").innerHTML =
			"<span style='color: green'>Contact successfully added!</span>";
		contactForm.reset();

		retrieveContacts();
	}
}

function refreshAllContacts() {
	tableBody.innerHTML = "";
	contactsArray.forEach((contact) => {
		insertNewRow(contact);
	});
}

function deleteContact(id) {
	let index = contactsArray.findIndex((contact) => contact.id === id);
	if (index !== -1) {
		contactsArray.splice(index, 1);
		alert("Contact successfully deleted!");

		var jsonData = JSON.stringify({
			id: id,
		});

		var xhr = new XMLHttpRequest();
		xhr.open("POST", "delete.php", true);
		xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");

		xhr.onreadystatechange = function () {
			if (xhr.readyState === 4 && xhr.status === 200) {
				console.log(xhr.responseText);
			}
		};

		xhr.send(jsonData);
		refreshAllContacts();
	}
}

function showEditContactForm(contact) {
	document.getElementById("result").innerHTML = "";
	submitBtn.removeEventListener("click", handleSubmitBtn);

	const formHeader = document.getElementById("formHeader");
	const lastName = document.getElementById("lastName");
	const firstName = document.getElementById("firstName");
	const emailAddress = document.getElementById("emailAddress");
	const contactNumber = document.getElementById("contactNumber");

	formHeader.innerHTML = "Edit Contact";
	lastName.value = contact.lastName;
	firstName.value = contact.firstName;
	emailAddress.value = contact.emailAddress;
	contactNumber.value = contact.contactNumber;
	submitBtn.innerHTML = "Save Contact";
	editingID = contact.id;

	submitBtn.addEventListener("click", handleEditBtn);
}

function editContact(id) {
	const lastName = document.getElementById("lastName").value;
	const firstName = document.getElementById("firstName").value;
	const emailAddress = document.getElementById("emailAddress").value;
	const contactNumber = document.getElementById("contactNumber").value;

	if (lastName && firstName && emailAddress && contactNumber) {
		let index = contactsArray.findIndex((contact) => contact.id === id);
		if (index !== -1) {
			contactsArray[index].lastName = lastName;
			contactsArray[index].firstName = firstName;
			contactsArray[index].emailAddress = emailAddress;
			contactsArray[index].contactNumber = contactNumber;

			var jsonData = JSON.stringify({
				id: id,
				lastName: lastName,
				firstName: firstName,
				emailAddress: emailAddress,
				contactNumber: contactNumber,
			});

			var xhr = new XMLHttpRequest();
			xhr.open("POST", "update.php", true);
			xhr.setRequestHeader(
				"Content-Type",
				"application/json;charset=UTF-8"
			);

			xhr.onreadystatechange = function () {
				if (xhr.readyState === 4 && xhr.status === 200) {
					console.log(xhr.responseText);
				}
			};

			xhr.send(jsonData);
		}

		document.getElementById("result").innerHTML =
			"<span style='color: green'>Contact successfully saved!</span>";
		contactForm.reset();

		refreshAllContacts();
		submitBtn.removeEventListener("click", handleEditBtn);
		submitBtn.addEventListener("click", handleSubmitBtn);
		submitBtn.innerHTML = "Add Contact";
	}
}

function retrieveContacts() {
	contactsArray = [];
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "retrieveContacts.php", true);
	xhr.onreadystatechange = function () {
		if (xhr.readyState === 4 && xhr.status === 200) {
			var responseData = JSON.parse(xhr.responseText);

			for (var i = 0; i < responseData.length; i++) {
				addContactObject(
					responseData[i].id,
					responseData[i].lastName,
					responseData[i].firstName,
					responseData[i].emailAddress,
					responseData[i].contactNumber
				);
			}
		}
	};

	xhr.send();
}

window.onload = () => {
	retrieveContacts();
	submitBtn.addEventListener("click", handleSubmitBtn);
};
