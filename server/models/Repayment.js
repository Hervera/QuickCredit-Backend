class Repayment {
  constructor(loanid, monthlyInstallment, paidamount, repaid, balance, remain, createdon) {
    this.loanid = loanid;
    this.monthlyInstallment = monthlyInstallment;
    this.paidamount = paidamount;
    this.repaid = repaid;
    this.balance = balance;
    this.remain = remain;
    this.createdon = createdon;
  }
}

export default Repayment;
