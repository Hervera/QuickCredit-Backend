class Repayment {
  constructor(loanId, monthlyInstallment, paidAmount, repaid, balance, remain, createdOn) {
    this.loanId = loanId;
    this.monthlyInstallment = monthlyInstallment;
    this.paidAmount = paidAmount;
    this.repaid = repaid;
    this.balance = balance;
    this.remain = remain;
    this.createdOn = createdOn;
  }
}

export default Repayment;
