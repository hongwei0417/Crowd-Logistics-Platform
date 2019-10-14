pragma solidity ^0.5.0;


contract Sender {
    address sender;
    uint delivery_time; //寄送時間
    uint service; //選擇服務
    bool isUrgent; //急件是否
    uint boxSize; //貨品大小
    string delivery_start_location; //送貨地點
    string delivery_end_location; //送貨終點
    string recipient_name; //收件人姓名
    string recipient_contact; //收件人聯絡方式


    constructor(uint dt, string memory dsl, string memory del, string memory rn, string memory rc, uint sv, bool isUr, uint bs) public {

        sender = msg.sender;

        delivery_time = dt;
        delivery_start_location = dsl;
        delivery_end_location = del;
        recipient_name = rn;
        recipient_contact = rc;
        service = sv;
        isUrgent = isUr;
        boxSize = bs;
    }

    function get_order_info() public view returns (uint, string memory, string memory, string memory, string memory, uint, bool, uint) {
        require(msg.sender == sender, "Only sender");

        return (delivery_time, delivery_start_location, delivery_end_location, recipient_name, recipient_contact, service, isUrgent, boxSize);
    }
}