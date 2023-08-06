// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Assessment {
    address payable public owner;
    uint256 public balance;
    address public nominee;
    uint256 public minimumDeposit;
    uint256 public fixedAmount;
    uint256 public interestRatePerSecond; // Added variable to store interest rate
    mapping(address => uint256) public userDepositAmount; // Store individual deposit amounts
    mapping(address => uint256) public userDailyWithdrawal; // Store daily withdrawal amount per user
    mapping(address => uint256) public lastWithdrawalTimestamp; // Store the timestamp of the last withdrawal per user

    uint256 public maxDailyWithdrawal; // Maximum allowed daily withdrawal amount

    event Deposit(uint256 amount);
    event Withdraw(uint256 amount);

    constructor(uint initBalance, uint256 _minimumDeposit, uint256 _fixedAmount, uint256 _maxDailyWithdrawal) payable {
        owner = payable(msg.sender);
        balance = initBalance;
        minimumDeposit = _minimumDeposit;
        fixedAmount = _fixedAmount;
        maxDailyWithdrawal = _maxDailyWithdrawal;
    }

    function getBalance() public view returns (uint256) {
        return balance;
    }

    function deposit(uint256 _amount) public payable {
        require(msg.sender == owner, "You are not the owner of this account");
        require(_amount >= minimumDeposit, "Deposit amount is below minimum");

        uint _previousBalance = balance;
        balance += _amount;
        userDepositAmount[msg.sender] += _amount; // Add the deposited amount for the user

        assert(balance == _previousBalance + _amount);

        emit Deposit(_amount);
    }

    error InsufficientBalance(uint256 balance, uint256 withdrawAmount);

    function withdraw(uint256 _withdrawAmount) public {
        require(msg.sender == owner || msg.sender == nominee, "You are not authorized to withdraw");
        uint _previousBalance = balance;

        if (balance < _withdrawAmount) {
            revert InsufficientBalance({
                balance: balance,
                withdrawAmount: _withdrawAmount
            });
        }

        // Check if the withdrawal amount exceeds the maximum daily withdrawal amount
        uint256 totalWithdrawalToday = userDailyWithdrawal[msg.sender];
        require(totalWithdrawalToday + _withdrawAmount <= maxDailyWithdrawal, "Withdrawal amount exceeds the daily limit");

        // Check if 24 hours have passed since the last withdrawal
        require(block.timestamp >= lastWithdrawalTimestamp[msg.sender] + 1 days, "Cannot withdraw more than once per day");

        // Update the user's withdrawal history and balance
        userDailyWithdrawal[msg.sender] += _withdrawAmount;
        lastWithdrawalTimestamp[msg.sender] = block.timestamp;
        balance -= _withdrawAmount;

        assert(balance == (_previousBalance - _withdrawAmount));

        emit Withdraw(_withdrawAmount);
    }

    function setNominee(address _nominee) public {
        require(msg.sender == owner, "You are not the owner of this account");
        nominee = _nominee;
    }

    
    function setInterestRatePerSecond(uint256 _rate) public {
        require(msg.sender == owner || msg.sender == nominee, "You are not authorized to set the interest rate");
        interestRatePerSecond = _rate;
    }

    function setMaxDailyWithdrawal(uint256 _maxAmount) public {
        require(msg.sender == owner, "You are not the owner of this account");
        maxDailyWithdrawal = _maxAmount;
    }
}
