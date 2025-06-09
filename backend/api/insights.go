package api

import (
	"fmt"
	"github.com/gin-gonic/gin"
	financial "github.com/razorpay/go-financial"
	"github.com/razorpay/go-financial/enums/frequency"
	"github.com/razorpay/go-financial/enums/interesttype"
	"github.com/razorpay/go-financial/enums/paymentperiod"
	"github.com/shopspring/decimal"
	"net/http"
	"time"
)

type MortgageDetails struct {
	Principal      float64 `json:"principal" binding:"required,gt=0"`
	TermYears      int     `json:"termYears" binding:"required,gt=0"`
	DownPayment    float64 `json:"downPayment" binding:"gte=0"`
	MonthlyPayment float64 `json:"monthlyPayment" binding:"required,gt=0"`
	TotalPayments  int     `json:"totalPayments" binding:"required,gt=0"`
	InterestRate   float64 `json:"interestRate" binding:"required,gt=0"` // annual %
	LoanAmount     float64 `json:"loanAmount" binding:"required,gt=0"`
	TotalPaid      float64 `json:"totalPaid"`
}

type AmortizationSchedule struct {
}

func RegisterInsightsRoutes(r *gin.Engine) {
	r.POST("/insights", getPaymentsTimeSeries)
}

func getPaymentsTimeSeries(c *gin.Context) {
	var req MortgageDetails
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	fmt.Print(req)
	rows := calculatePayments(&req)
	c.JSON(200, gin.H{"data": rows})
}

func calculatePayments(mortgage *MortgageDetails) []financial.Row {
	currentDate := time.Now()
	endDate := time.Now().AddDate(0, mortgage.TotalPayments, 0).AddDate(0, 0, -1)
	basisPoints := mortgage.InterestRate * 100
	config := financial.Config{
		StartDate:              currentDate,
		EndDate:                endDate,
		Frequency:              frequency.MONTHLY,
		AmountBorrowed:         decimal.NewFromFloat(mortgage.Principal),
		InterestType:           interesttype.REDUCING,
		Interest:               decimal.NewFromFloat(basisPoints),
		PaymentPeriod:          paymentperiod.ENDING,
		EnableRounding:         true,
		RoundingPlaces:         0,
		RoundingErrorTolerance: decimal.Zero,
	}
	amortization, err := financial.NewAmortization(&config)
	if err != nil {
		fmt.Print("err 1")
		panic(err)
	}
	rows, err := amortization.GenerateTable()
	if err != nil {
		fmt.Print("err 1")
		panic(err)
	}
	financial.PrintRows(rows)
	return rows
}
