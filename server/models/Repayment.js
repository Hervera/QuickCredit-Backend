class Repayment {
  constructor(loanId, monthlyInstallment, paidamount, repaid, balance, remain, createdon) {
    this.loanId = loanId;
    this.monthlyInstallment = monthlyInstallment;
    this.paidamount = paidamount;
    this.repaid = repaid;
    this.balance = balance;
    this.remain = remain;
    this.createdon = createdon;
  }
}

export default Repayment;
