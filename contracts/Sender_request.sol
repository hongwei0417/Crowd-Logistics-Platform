pragma solidity ^0.5.0;


contract Sender_Request {

    mapping(address => mapping(uint => Order)) User;

    event return_tx_time(uint time);
    
    struct Order {
        uint delivery_time; //寄送時間
        uint service; //選擇服務
        bool isUrgent; //急件是否
        uint boxSize; //貨品大小
        string delivery_start_location; //送貨地點
        string delivery_end_location; //送貨終點
        string recipient_name; //收件人姓名
        string recipient_contact; //收件人聯絡方式
    }


    function set_order_info(
        uint dt,
        string memory dsl,
        string memory del,
        string memory rn,
        string memory rc,
        uint sv,
        bool isUr,
        uint bs
    ) public {

        Order memory order = Order({
            delivery_time: dt,
            delivery_start_location: dsl,
            delivery_end_location: del,
            recipient_name: rn,
            recipient_contact: rc,
            service: sv,
            isUrgent: isUr,
            boxSize: bs
        });

        uint time = now;
        
        User[msg.sender][time] = order;

        emit return_tx_time(time);
    }

    function get_order_info(uint time) public view returns (
        uint, 
        string memory,
        string memory,
        string memory,
        string memory,
        uint,
        bool,
        uint
    ) {

        Order memory order = User[msg.sender][time];

        return (
            order.delivery_time,
            order.delivery_start_location,
            order.delivery_end_location,
            order.recipient_name,
            order.recipient_contact,
            order.service,
            order.isUrgent,
            order.boxSize
        );
    }

}