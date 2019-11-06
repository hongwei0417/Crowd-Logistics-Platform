pragma solidity ^0.5.0;

contract Transaction {

    address[] private Sender;
    address[] private Driver;
    
    event get_match(address, address); //取得配對合約
    
    function get_sender() public view returns(address[] memory){
        return Sender;
    }
    
    function get_driver() public view returns(address[] memory){
        return Driver;
    }

    function push_sender(address sender) public {
        Sender.push(sender);
    }

    function pop_sender(uint index) public returns(address){
        
        require(index < Sender.length);
        
        address sender = Sender[index];
        
        delete Sender[index];
        
        for(uint i = index; i < Sender.length-1; i++) {
            Sender[i] = Sender[i+1];
        }
        
        Sender.length--;
        
        return sender;
    }

    function push_driver(address driver) public {
        Driver.push(driver);
    }

    function pop_driver(uint index) public returns(address){
        require(index < Driver.length);
        
        address driver = Driver[index];
        
        delete Driver[index];

        for(uint i = index; i < Driver.length-1; i++) {
            Driver[i] = Driver[i+1];
        }
        
        Driver.length--;
        
        return driver;
    }
    
    function matching() public {
        require(Sender.length > 0 && Driver.length > 0, "No Member!");
        
        address sender = pop_sender(0);
        address driver = pop_driver(0);
        
        emit get_match(sender, driver);
        
    }
}