pragma solidity ^0.5.0;

contract Transaction {

    address[] private Sender; //寄送方
    
    mapping(address => address[]) Driver; //一個寄送方對多個和司機
    
    event get_match(address, address); //取得配對合約
    
    function get_sender() public view returns(address[] memory){
        return Sender;
    }
    
    function get_driver(address sender) public view returns(address[] memory){
        return Driver[sender];
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

    function push_driver(address sender, address driver) public {
        Driver[sender].push(driver);
    }

    function pop_driver(address sender) public returns(address){
        require(Driver[sender].length > 0);
        
        address driver = Driver[sender][0]; //取得第一位
        
        delete Driver[sender];
        
        return driver;
    }
    
    function matching() public { //配對第一位

        require(Sender.length > 0 || Driver[Sender[0]].length > 0);
        
        address sender = pop_sender(0);
        address driver = pop_driver(sender);
        
        emit get_match(sender, driver);
    }

    function clear() public {
        delete Sender;
    }

    function check_matching() public returns (bool) {
        bool can_match = false;

        if(Driver[Sender[0]].length > 0) {
            can_match = true;
        }
        return can_match;
    }
}