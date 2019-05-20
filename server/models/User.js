class User {
  constructor(firstName, lastName, email, password, address, status, isAdmin, createdOn, updatedOn) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
    this.address = address;
    this.status = status;
    this.isAdmin = isAdmin;
    this.createdOn = createdOn;
    this.updatedOn = updatedOn;
  }
}

export default User;
