pragma solidity ^0.5.0;
// import "github.com/provable-things/ethereum-api/provableAPI.sol";


contract Sender_Auth {
    string name; //姓名
    uint sex; //生理性別
    uint birthday; //生日
    string phone_number; //電話號碼
    string email; //電子郵件
    string cid; //身分證字號
    string psd; //密碼
    string psd_hint; //密碼提示

    event verification_status(bool valid);


    constructor() public {
    }

    function set_sender_data (
        string memory _name, uint _sex, uint btd, string memory pn, string memory _email,
        string memory _cid, string memory _psd, string memory _psd_hint ) public {

        name = _name;
        sex = _sex;
        birthday = btd;
        phone_number = pn;
        email = _email;
        cid = _cid;
        psd = _psd;
        psd_hint = _psd_hint;
    }

    function verify_info() public {
    
        require(bytes(name).length != 0, "name is empty!"); //姓名不為空
        require(bytes(phone_number).length != 0, "phone number is empty!"); //電話不可為空

        bool email_result = verify_email(email); //驗證信箱規則
        bool cid_result = verify_cid(cid); //驗證身分證字號
        bool psd_result = verify_psd(psd, psd_hint); //驗證密碼規則

        if(email_result && cid_result && psd_result) {
            emit verification_status(true); //回傳審核成功
        } else {
            emit verification_status(false); //回傳審核失敗
        }
    }

    function verify_cid(string memory _cid) public returns (bool valid) {
        uint len = bytes(_cid).length;
        if(len != 10){
            return false;
        }
        else {
            return true;
        }
    }

    function verify_email(string memory _email) public returns(bool valid) {
        uint len = bytes(_email).length;
        if(len < 10){
            return false;
        }
        else {
            return true;
        }
    }

    function verify_psd(string memory _psd, string memory _psd_hint) public view returns(bool valid) {
        uint len1 = bytes(_psd).length;
        uint len2 = bytes(_psd_hint).length;

        if(len1 < 8 && len2 == 0){
            return false;
        }
        else {
            return true;
        }
    }

    
}