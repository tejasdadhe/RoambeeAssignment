var userData,savings,operationData;
const rupeeSymbol = '&#x20b9;';
const errorType = {'empty_value': 0,'percentage_error': 1};

function showInputError(id)
{
    console.log("this");
    const input = document.getElementById(id);
    input.style.border = "1px solid red";
    input.style.boxShadow = "0px 0px 5px red";
    input.onchange = function() {
        if(input.value != "") {
            input.style.border = "";
            input.style.boxShadow = "";
            input.onchange = null;
        }   
    }
}

function showErrorMessage(error)
{
    const errorBox = document.getElementById("error-text");
    if(error == errorType.empty_value)
    {
        errorBox.innerHTML = "The highlighted input field cannot be empty!"
    }
    else if(error == errorType.percentage_error)
    {
        errorBox.innerHTML = "The highlighted input field should have value between 0 and 100"
    }
    errorBox.style.display = "block";
    
}


function validateCompanyData(companyData)
{
    if(companyData.consignmentCount == "")
    {
        showInputError("c_count");
        return false;
    }

    console.log("Parameter Value %j",companyData);
    return true;
}

function validateOperationData(operationData)
{
    const errorBox = document.getElementById("error-text");
    if(operationData.consignMentsPerAnnum == "")
    {
        showErrorMessage(errorType.empty_value);
        console.log("empty string");
        return false;
    }
    if(operationData.avgValuePerShipment == "")
    {
        showErrorMessage(errorType.empty_value);
        console.log("empty string");
        showInputError("vps");
        return false;
    }
    if(operationData.avgShippingCostPerShipment == "")
    {
        showErrorMessage(errorType.empty_value);
        console.log("empty string");
        showInputError("cps");
        return false;
    }
    if(operationData.avgShipmentDuration == "")
    {
        showErrorMessage(errorType.empty_value);
        console.log("empty string");
        showInputError("spd");
        return false;
    }
    if(operationData.percentageCoPay == "")
    {
        showErrorMessage(errorType.empty_value);
        console.log("empty string");
        showInputError("co_pay");
        return false;
    }
    if(Number(operationData.percentageCoPay)>100 || Number(operationData.percentageCoPay)<0)
    {
        showErrorMessage(errorType.percentage_error);
        console.log("invalid value");
        showInputError("co_pay");
        return false;
    }

    if(operationData.damagedShipmentsPerYear == "")
    {
        showErrorMessage(errorType.empty_value);
        console.log("empty string");
        showInputError("damaged_shipment");
        return false;
    }
    if(operationData.borrowingInterestRate == "")
    {
        showErrorMessage(errorType.empty_value);
        console.log("empty string");
        showInputError("borrow_roi");
        return false;
    }
    if(Number(operationData.borrowingInterestRate)>100 || Number(operationData.borrowingInterestRate) < 0)
    {
        showErrorMessage(errorType.percentage_error);
        console.log("invalid percentage");
        showInputError("borrow_roi");
        return false;
    }
    if(operationData.shipmentsDetained == "")
    {
        showErrorMessage(errorType.empty_value);
        console.log("empty string");
        showInputError("shp_dtnd");
        return false;
    }
    if(Number(operationData.shipmentsDetained)>100 || Number(operationData.shipmentsDetained)<0)
    {
        showErrorMessage(errorType.percentage_error);
        console.log("invalid value");
        showInputError("shp_dtnd");
        return false;
    }

    if(operationData.averageDetainedDays == "")
    {
        showErrorMessage(errorType.empty_value);
        console.log("empty string");
        showInputError("avg_dtnd");
        return false;
    }
    if(operationData.detentionChargePerDay == "")
    {
        showErrorMessage(errorType.empty_value);
        console.log("empty string");
        showInputError("dtmnt_per_day");
        return false;
    }
    document.getElementById("error-text").style.display = "none"
    return true;
}

function processCompanyInfo()
{
    const firstName        = document.getElementById("f_name").value;
    const lastName         = document.getElementById("l_name").value;
    const email            = document.getElementById("email").value;
    const companyName      = document.getElementById("c_name").value;
    const consignmentCount = document.getElementById("c_count").value;

    companyData = {firstName,lastName,email,companyName,consignmentCount}

    if(validateCompanyData(companyData))
    {
        const page1 = document.getElementById("page1");
        const page2 = document.getElementById("page2");
        const inputConsignmentperAnnum = document.getElementById("cpa");

        page1.className = "container hidden-container";
        page2.className = "container visible-container";

        inputConsignmentperAnnum.value =consignmentCount;
        console.log(inputConsignmentperAnnum);
    }
}



function calculateSavings(x)
{
    const savedProductSpoilagePrevention = Math.ceil((x.percentageCoPay/100) * x.avgValuePerShipment * x.damagedShipmentsPerYear);
    const savedReshippingCosts = Math.ceil(x.damagedShipmentsPerYear * x.avgShippingCostPerShipment);
    const savedWorkingCapitalInt = Math.ceil((x.avgValuePerShipment * (x.borrowingInterestRate/100)/365) * x.avgShipmentDuration * x.damagedShipmentsPerYear);
    const savedDetentionCosts = Math.ceil(x.detentionChargePerDay * x.consignMentsPerAnnum * (x.shipmentsDetained/100) * x.averageDetainedDays);
    const savedTotal = Math.ceil(savedProductSpoilagePrevention + savedReshippingCosts + savedWorkingCapitalInt + savedDetentionCosts);
    
    savings = {savedProductSpoilagePrevention,savedReshippingCosts,savedWorkingCapitalInt,savedDetentionCosts,savedTotal};
    return savings;
}




function processOperationData()
{
    consignMentsPerAnnum =       document.getElementById('cpa').value;                  // Number of Consignments per Annum
    avgValuePerShipment =        document.getElementById('vps').value;                  // Average value as declared on insurance papers
    avgShippingCostPerShipment = document.getElementById('cps').value;                  // Average shipping or freight cost per shipment
    avgShipmentDuration =        document.getElementById('spd').value;                  // Average shipment duration in days
    percentageCoPay =            document.getElementById('co_pay').value;               // Percentage of insurance co-pay in case of a claim
    damagedShipmentsPerYear =    document.getElementById('damaged_shipment').value;     // Number of shipments out of the total that arrive damaged in a year
    borrowingInterestRate =      document.getElementById('borrow_roi').value;           // Borrowing rate of interest for your working capital in your business
    shipmentsDetained =          document.getElementById('shp_dtnd').value;             // Percentage of shipments detained beyond normal limits
    averageDetainedDays =        document.getElementById('avg_dtnd').value;             // Number of days that these shipments were detained for on an average
    detentionChargePerDay =      document.getElementById('dtmnt_per_day').value;        // Cost per shipment per day od detainment


    operationData = {
        consignMentsPerAnnum, avgValuePerShipment, avgShippingCostPerShipment, avgShipmentDuration,
        percentageCoPay,damagedShipmentsPerYear,borrowingInterestRate,shipmentsDetained,averageDetainedDays,
        detentionChargePerDay
    }
    
    if(validateOperationData(operationData))
    {
        const results = document.getElementById("results");
        const savings = calculateSavings(operationData);

        results.className = "visible-container";

        document.getElementById("savings_product_spoilage").innerHTML = rupeeSymbol + savings.savedProductSpoilagePrevention;
        document.getElementById("savings_reshipping_costs").innerHTML = rupeeSymbol + savings.savedReshippingCosts;
        document.getElementById("savings_cap_int").innerHTML = rupeeSymbol + savings.savedWorkingCapitalInt;
        document.getElementById("savings_det").innerHTML = rupeeSymbol + savings.savedDetentionCosts;
        document.getElementById("savings_tot").innerHTML = rupeeSymbol + savings.savedTotal;
        window.scrollTo(0,document.body.scrollHeight);
    }  
}







//console.log("Savings : %j",calculateSavings(operationData));