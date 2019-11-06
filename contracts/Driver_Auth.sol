pragma solidity ^0.5.0;
// import "github.com/provable-things/ethereum-api/provableAPI.sol";


contract Driver_Auth {
    string name; //姓名
    uint sex; //生理性別
    uint birthday; //生日
    string phone_number; //電話號碼
    string email; //電子郵件
    string cid; //身分證字號
    string psd; //密碼
    string psd_hint; //密碼提示
    string driver_license; //駕照號碼
    string license_plate; //車牌號碼
    bool insurance_valid; //強制責任險有效性
    bool drunk_driving; //酒醉紀錄
    

    event verification_status(bool valid, string dl, string lp); //資料是否驗證成功

    function set_driver_data(
        string memory _name, uint _sex, uint btd, string memory pn, string memory _email,
        string memory _cid, string memory _psd, string memory _psd_hint) public {
        
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

        driver_license = get_driver_license(birthday, cid); //取得司機車牌
        license_plate = get_license_plate(birthday, cid); //取得司機車牌

        bool email_result = verify_email(email); //驗證信箱規則
        bool cid_result = verify_cid(cid); //驗證身分證字號
        bool psd_result = verify_psd(psd, psd_hint); //驗證密碼規則
        bool insurance_valid = is_insurance_valid(cid, driver_license); //驗證強制責任險有效性
        bool dd_result = is_drunk_driving(birthday, cid); //是否有酒駕紀錄
        

        if(email_result && cid_result && psd_result && dd_result && insurance_valid) {
            emit verification_status(true, driver_license, license_plate); //回傳審核成功+駕照+車牌
        } else {
            emit verification_status(false,"",""); //回傳審核失敗
        }
    }


    function verify_cid(string memory _cid) public view returns (bool valid) {
        uint len = bytes(_cid).length;
        if(len != 10){
            return false;
        }
        else {
            return true;
        }
    }

    function verify_email(string memory _email) public view returns(bool valid) {
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

    //使用身分證字號和生日即可查詢駕照
    function get_driver_license(uint btd, string memory _cid) public view returns(
            string memory dl ) {
        
        return "A123456789";
    }

    //使用身分證字號和生日即可查詢車牌
    function get_license_plate(uint btd, string memory _cid) public view returns(
            string memory ) {
        
        return "5799KE";
    }

    //使用身分證字號和車牌即可查詢強制責任險
    function is_insurance_valid(string memory _cid, string memory dl) public view returns(
            bool) {
        
        return true;
    }


    //使用身分證字號和生日即可查詢酒駕紀錄
    function is_drunk_driving(uint btd, string memory _cid) public view returns(bool valid) {

        return true;
    }

    
}