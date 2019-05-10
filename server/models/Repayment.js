class Repayment {
  constructor(id, loanId, monthlyInstallment, paidAmount, repaid, balance, remain, createdOn) {
    this.id = id;
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
