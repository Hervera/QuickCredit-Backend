class Loan {
  constructor(useremail, createdon, status, repaid, tenor, amount, paymentinstallment, balance, interest, updatedon) {
    this.useremail = useremail;
    this.createdon = createdon;
    this.status = status;
    this.repaid = repaid;
    this.tenor = tenor;
    this.amount = amount;
    this.paymentinstallment = paymentinstallment;
    this.balance = balance;
    this.interest = interest;
    this.updatedon = updatedon;
  }
}

export default Loan;
