const insertUser = `INSERT INTO users(firstName, lastName, email, password, address, status, isAdmin, createdOn, updatedOn)
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9) returning *`;

const selectUser = 'SELECT * FROM users WHERE email = $1;';

export default { insertUser, selectUser };
