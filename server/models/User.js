class User {
  constructor(firstname, lastname, email, password, address, status, isadmin, createdon, updatedon) {
    this.firstname = firstname;
    this.lastname = lastname;
    this.email = email;
    this.password = password;
    this.address = address;
    this.status = status;
    this.isadmin = isadmin;
    this.createdon = createdon;
    this.updatedon = updatedon;
  }
}

export default User;
