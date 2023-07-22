// SPDX-License-Identifier: MIT
// SPDX license identifier specifies which open-source license is being used for the contract
pragma solidity ^0.8.9;

// Importing external contracts for dependencies
import { AxelarExecutable } from '@axelar-network/axelar-gmp-sdk-solidity/contracts/executable/AxelarExecutable.sol';
import { IAxelarGateway } from '@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGateway.sol';
import { IAxelarGasService } from '@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IAxelarGasService.sol';
import { IERC20 } from '@axelar-network/axelar-gmp-sdk-solidity/contracts/interfaces/IERC20.sol';

contract SendMessage is AxelarExecutable {

    string public value;
    string public sourceChain;
    string public sourceAddress;

    IAxelarGasService public immutable gasService;

    constructor(address gateway_, address gasReceiver_) AxelarExecutable(gateway_){
        // set the immutable state variable to the address of gasReceiver_
        gasService = IAxelarGasService(gasReceiver_);
    }


    function sendMessage(string calldata destinationChain, string calldata destinationAddress, string calldata value_) external payable {
        
        bytes memory payload = abi.encode(value_);

        if(msg.value > 0){
            gasService.payNativeGasForContractCall {value: msg.value}(address(this), destinationChain, destinationAddress, payload, msg.sender);
        }

        // call the Axelar Gateway contract with specified destination chain and address
        // send the payload along with the call

        gateway.callContract(destinationChain, destinationAddress, payload);
    }

    function _execute(string calldata sourceChain_, string calldata sourceAddress_, bytes calldata payload_) internal override {
        // decode the payload bytes into string value  and set the state variable for this contract
        (value) = abi.decode(payload_, (string));

        sourceChain = sourceChain_;
        sourceAddress = sourceAddress_;
    }

}