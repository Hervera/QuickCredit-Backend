class User {
  constructor(id, firstName, lastName, email, password, address, status, isAdmin, createdOn) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
    this.address = address;
    this.status = status;
    this.isAdmin = isAdmin;
    this.createdOn = createdOn;
  }
}

export default User;
