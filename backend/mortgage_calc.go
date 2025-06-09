package main

//
//import (
//	"github.com/gin-gonic/gin"
//	"math"
//	"net/http"
//)
//
//type MortgageRequest struct {
//	LoanAmount   float64 `json:"loanAmount" binding:"required,gt=0"`
//	InterestRate float64 `json:"interestRate" binding:"required,gt=0"` // annual %
//	TermYears    int     `json:"termYears" binding:"required,gt=0"`
//	DownPayment  float64 `json:"downPayment" binding:"omitempty,gte=0"`
//}
//
//type MortgageResponse struct {
//	Principal      float64 `json:"principal"`
//	MonthlyPayment float64 `json:"monthlyPayment"`
//	TotalPayments  int     `json:"totalPayments"`
//	TotalPaid      float64 `json:"totalPaid"`
//}
//
//func calculateMortgage(c *gin.Context) {
//	var req MortgageRequest
//	if err := c.ShouldBindJSON(&req); err != nil {
//		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
//		return
//	}
//
//	P := req.LoanAmount - req.DownPayment
//	if P <= 0 {
//		c.JSON(http.StatusBadRequest, gin.H{"error": "down payment must be less than loan amount"})
//		return
//	}
//
//	// monthly rate and total payments
//	rMonthly := req.InterestRate / 100.0 / 12.0
//	n := float64(req.TermYears * 12)
//
//	// M = P * [ r(1+r)^n / ((1+r)^n - 1) ]
//	factor := math.Pow(1+rMonthly, n)
//	M := P * (rMonthly * factor) / (factor - 1)
//
//	resp := MortgageResponse{
//		Principal:      math.Round(P*100) / 100,
//		MonthlyPayment: math.Round(M*100) / 100,
//		TotalPayments:  int(n),
//		TotalPaid:      math.Round(M*n*100) / 100,
//	}
//
//	c.JSON(http.StatusOK, resp)
//}
