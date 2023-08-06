# Assessment Contract

This smart contract is designed to manage deposits and withdrawals with a daily withdrawal limit and an interest rate. It allows an owner to deposit funds, set a nominee, set an interest rate, and set a maximum daily withdrawal limit. The contract also ensures that only the owner or the designated nominee can withdraw funds.

## Contract Details

The contract is written in Solidity version 0.8.9.

## Functions

### Constructor

The constructor initializes the contract with the following parameters:

- `initBalance`: The initial balance of the contract.
- `_minimumDeposit`: The minimum amount allowed for a deposit.
- `_fixedAmount`: A fixed amount (not used in the current implementation).
- `_maxDailyWithdrawal`: The maximum amount that can be withdrawn daily.

### `getBalance()` Function

This function is a view function that allows anyone to check the current balance of the contract.

### `deposit(uint256 _amount)` Function

This function allows the owner to deposit funds into the contract. The deposited amount must be equal to or greater than the minimum deposit amount set during contract deployment.

### `withdraw(uint256 _withdrawAmount)` Function

This function allows the owner or the nominee to withdraw funds from the contract. It checks the available balance and ensures that the withdrawal amount does not exceed the maximum daily withdrawal limit. Users are allowed to make withdrawals once every 24 hours.

### `setNominee(address _nominee)` Function

This function allows the contract owner to set a nominee, who will also have the authority to withdraw funds from the contract.

### `setInterestRatePerSecond(uint256 _rate)` Function

This function allows the contract owner or the nominee to set the interest rate per second. However, the interest rate is not used in the current implementation.

### `setMaxDailyWithdrawal(uint256 _maxAmount)` Function

This function allows the contract owner to set the maximum daily withdrawal amount.

## Events

### `Deposit(uint256 amount)` Event

This event is emitted whenever a deposit is made to the contract. It indicates the amount that was deposited.

### `Withdraw(uint256 amount)` Event

This event is emitted whenever a withdrawal is made from the contract. It indicates the amount that was withdrawn.

## Error

### `InsufficientBalance(uint256 balance, uint256 withdrawAmount)` Error

This error is raised when an attempt is made to withdraw an amount greater than the available balance in the contract.

## Usage

To use this contract, you should:

1. Deploy the contract, providing the initial balance, minimum deposit, fixed amount, and maximum daily withdrawal limit.
2. The contract owner can then deposit funds into the contract using the `deposit` function.
3. The contract owner can set a nominee using the `setNominee` function to allow the nominee to withdraw funds.
4. The contract owner or the nominee can set the interest rate per second using the `setInterestRatePerSecond` function.
5. The contract owner can also set the maximum daily withdrawal limit using the `setMaxDailyWithdrawal` function.
6. The contract owner or the nominee can then withdraw funds from the contract using the `withdraw` function, subject to the daily withdrawal limit.

**Note**: This contract is a simplified version intended for educational purposes and may not be suitable for use in production environments. It lacks security features like access control modifiers and proper error handling.

---

**Author**: Shreyanshi Mishra
**Email**: shreyanshimishra7689@gmail.com
