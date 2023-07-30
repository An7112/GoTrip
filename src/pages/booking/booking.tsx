import React, { useEffect, useState } from 'react'
import './booking.css'
import { BiSolidPlaneAlt } from 'react-icons/bi'
import { Button, DatePicker, Form, Input, InputNumber, Select, Checkbox } from 'antd'
import { Row, Col } from 'antd';
import dayjs from 'dayjs';
// import 'antd/dist/antd.css';
import 'dayjs/locale/vi';
import { BookingType } from 'modal/index';
import { convertCity, formatNgayThangNam, formatNgayThangNam4, getAirlineFullName, getNumberOfStops } from 'utils/custom/custom-format';
import { useDispatch } from 'react-redux';
import { setOutPage } from 'store/reducers';
dayjs.locale('vi')


interface FormData {
    lastname?: string;
    firstname?: string;
    email?: string;
    phone?: string;
    content?: string;
    taxCode?: string;
    companyName?: string;
    companyAddress?: string
}

const { Option } = Select;

function Booking() {


    const countryCodes = ['+84', '+1', '+44', '+86', '+81'];
    const content = ['Ông', 'Bà'];
    const contentChid = ['Trẻ em trai', 'Trẻ em gái'];
    const contentBaby = ['Bé trai', 'Bé gái'];

    const [formData, setFormData] = useState<FormData>({})
    const [formDataInf, setFormDataInf] = useState([{ content: 'Ông', fullname: '', luggage: 1 }]);
    const [formDataInfChid, setFormDataInfChid] = useState([{ contentChid: 'Trẻ em trai', fullnameChid: '', date: '' }]);
    const [formDataInfBaby, setFormDataInfBaby] = useState([{ contentBaby: 'Bé trai', fullnameBaby: '', dateBaby: '' }]);
    const [errors, setErrors] = useState<string[]>([]);
    const [errorsBaby, setErrorsBaby] = useState<string[]>([]);
    const [dataBooking, setDataBooking] = useState<BookingType[]>([])
    const [bill, setBill] = useState(false)

    const [errorMessages, setErrorMessages] = useState<FormData>({});

    useEffect(() => {
        const isArrayLocal = localStorage.getItem('bookingInf')
        if (isArrayLocal) {
            setDataBooking(JSON.parse(isArrayLocal))
        }
    }, [])

    useEffect(() => {
        return () => {
            localStorage.setItem('outPage', JSON.stringify(false));
        }
    }, [])

    useEffect(() => {
        if (dataBooking.length > 0) {
            const newFormDataInf = Array.from({ length: dataBooking[0].Adt }, () => ({
                content: 'Ông',
                fullname: '',
                luggage: 1
            }));
            const newFormDataInfChid = Array.from({ length: dataBooking[0].Chd }, () => ({
                contentChid: 'Trẻ em trai',
                fullnameChid: '',
                date: ''
            }));
            const newFormDataInfBayby = Array.from({ length: dataBooking[0].Inf }, () => ({
                contentBaby: 'Bé trai',
                fullnameBaby: '',
                dateBaby: ''
            }));
            setFormDataInfBaby(newFormDataInfBayby)
            setFormDataInfChid(newFormDataInfChid)
            setFormDataInf(newFormDataInf);
        }
    }, [dataBooking]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
        setErrorMessages((prevErrors) => ({ ...prevErrors, [name]: '' }));
    };

    const handleInputChangeInf = (index: number, field: string, value: any) => {
        console.log(index, field, value)
        const updatedFormData: any = [...formDataInf];
        updatedFormData[index][field] = value;
        setFormDataInf(updatedFormData);
    };

    const handleInputChangeInfChid = (index: number, field: string, value: any) => {
        const updatedFormData: any = [...formDataInfChid];
        updatedFormData[index][field] = value;
        setFormDataInfChid(updatedFormData);

        if (field === 'date') {
            const currentDate = dayjs();
            const selectedDate = dayjs(value);

            const age = currentDate.diff(selectedDate, 'year');
            if (age < 2 || age > 12) {
                const updatedErrors: any = [...errors];
                updatedErrors[index] = 'Tuổi phải từ 2 đến 12 tuổi';
                setErrors(updatedErrors);
            } else {
                const updatedErrors: any = [...errors];
                updatedErrors[index] = '';
                setErrors(updatedErrors);
            }
        }
    };

    const handleInputChangeInfBaby = (index: number, field: string, value: any) => {
        const updatedFormData: any = [...formDataInfBaby];
        updatedFormData[index][field] = value;
        setFormDataInfBaby(updatedFormData);

        if (field === 'dateBaby') {
            const currentDate = dayjs();
            const selectedDate = dayjs(value);

            const age = currentDate.diff(selectedDate, 'year');
            if (age > 2) {
                const updatedErrors: any = [...errorsBaby];
                updatedErrors[index] = 'Tuổi phải nhỏ hơn 2';
                setErrorsBaby(updatedErrors);
            } else {
                const updatedErrors: any = [...errorsBaby];
                updatedErrors[index] = '';
                setErrorsBaby(updatedErrors);
            }
        }
    };

    const handleSubmit = () => {
        const errors: FormData = {};
        if (!formData.lastname) {
            errors.lastname = 'Vui lòng nhập họ của bạn';
        }
        if (!formData.firstname) {
            errors.firstname = 'Vui lòng nhập tên của bạn';
        }
        if (!formData.phone) {
            errors.phone = 'Vui lòng nhập số điện thoại của bạn';
        }
        if (!formData.email) {
            errors.email = 'Vui lòng nhập email';
        }
        setErrorMessages(errors);
        if (Object.keys(errors).length === 0) {
            console.log(formData);
        }
    };

    const handleSubmitInf = () => {
        handleSubmit()
        console.log([...formDataInf, ...formDataInfChid, ...formDataInfBaby]);
    };


    const getAirlineLogo = (abbr: string, style: string) => {
        switch (abbr) {
            case 'VJ':
                return <img style={{ width: style, height: style }} className='paginated-item-img' src='media/logo/vietjetair.jpg' alt='vj' />;
            case 'VN':
                return <img style={{ width: style, height: style }} className='paginated-item-img' src='media/logo/vietnamairlines.png' alt='vn' />;
            case 'QH':
                return <img style={{ width: style, height: style }} className='paginated-item-img' src='media/logo/bamboo.png' alt='qh' />;
            case 'VU':
                return <img style={{ width: style, height: style }} className='paginated-item-img' src='media/logo/vietravel.png' alt='vu' />;
            default:
                return <img style={{ width: style, height: style }} className='paginated-item-img' alt={abbr} />;
        }
    };

    function formatNumber(number: number) {
        const roundedNumber = Math.ceil(number / 1000) * 1000;
        const formattedNumber = new Intl.NumberFormat('vi-VN').format(roundedNumber);

        return formattedNumber;
    }

    const handleGoBack = () => {
        window.history.go(-1);
    };

    const total = dataBooking.reduce((num, cur) =>
        num +=
        (cur.FareAdt * cur.Adt + cur.FareChd * cur.Chd + cur.FareInf * cur.Inf + cur.TotalFeeTaxAdt + cur.TotalFeeTaxChd + cur.TotalFeeTaxInf)
        , 0)

    return (
        <section className='booking-section'>
            <div className='booking-container'>
                <h3 className='title-page'>Đặt phòng của bạn.</h3>
                <p className='dsc-page'>Điền thông tin chi tiết của bạn và xem lại đặt phòng của bạn.</p>
                <div className='booking-grid'>
                    <div className='flex-col'>
                        <Form layout="vertical" onFinish={handleSubmitInf}>
                            <div className='booking-grid-item col-2'>
                                <h3 className='title-page'>Thông tin chi tiết về khách du lịch.</h3>
                                <div className='contact-form'>
                                    <div className='contact-header'>
                                        <p className='text-15'>Thông tin hành khách</p>
                                    </div>
                                    {dataBooking.length > 0 && dataBooking[0].Adt > 0
                                        && <Row>
                                            <div className='contact-header inner'>
                                                <p className='text-15'>Thông tin người lớn</p>
                                            </div>
                                        </Row>
                                    }
                                    {formDataInf.map((formItem, index) => (
                                        <Row gutter={[16, 16]} key={index}>
                                            <Col span={24} sm={24} style={{ alignItems: 'center', display: 'flex' }}>
                                                <p style={{ fontWeight: '700' }}>Người lớn {index + 1}</p>
                                            </Col>
                                            <Col span={9} sm={9} xs={24}>
                                                <Form.Item
                                                    label="Tiêu đề"
                                                    name={['content', index]}
                                                    rules={[{ required: true, message: 'Tiêu đề là bắt buộc' }]}
                                                >
                                                    <Select
                                                        value={formItem.content}
                                                        onChange={(value) => handleInputChangeInf(index, 'content', value)}
                                                    >
                                                        {content.map((code) => (
                                                            <Select.Option key={code} value={code}>
                                                                {code}
                                                            </Select.Option>
                                                        ))}
                                                    </Select>
                                                </Form.Item>
                                            </Col>
                                            <Col span={9} sm={9} xs={24}>
                                                <Form.Item
                                                    label="Họ và tên"
                                                    name={['fullname', index]}
                                                    rules={[{ required: true, message: 'Vui lòng nhập họ và tên của bạn' }]}
                                                >
                                                    <Input
                                                        value={formItem.fullname}
                                                        onChange={(e) => handleInputChangeInf(index, 'fullname', e.target.value)}
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col span={6} sm={6} xs={12}>
                                                <Form.Item
                                                    label="Thêm hành lý"
                                                    name={['luggage', index]}
                                                >
                                                    <Select
                                                        defaultValue="1"
                                                        onChange={(value) => handleInputChangeInf(index, 'luggage', value)}
                                                        options={[
                                                            { value: '1', label: '1' },
                                                            { value: '2', label: '2' },
                                                            { value: '3', label: '3' },
                                                        ]}
                                                    />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    ))}
                                    {dataBooking.length > 0 && dataBooking[0].Chd > 0 && <Row>
                                        <div className='contact-header inner'>
                                            <p className='text-15'>Thông tin trẻ em từ 2 đến 12 tuổi</p>
                                        </div>
                                    </Row>}
                                    {formDataInfChid.map((formItem, index) => (
                                        <Row gutter={[16, 16]} key={index}>
                                            <Col span={24} sm={24} style={{ alignItems: 'center', display: 'flex' }}>
                                                <p style={{ fontWeight: '700' }}>Trẻ em {index + 1}</p>
                                            </Col>
                                            <Col span={8} sm={8} xs={24}>
                                                <Form.Item
                                                    label="Tiêu đề"
                                                    name={['contentChid', index]}
                                                    rules={[{ required: true, message: 'Tiêu đề là bắt buộc' }]}
                                                >
                                                    <Select
                                                        value={formItem.contentChid}
                                                        onChange={(value) => handleInputChangeInfChid(index, 'contentChid', value)}
                                                    >
                                                        {contentChid.map((code) => (
                                                            <Select.Option key={code} value={code}>
                                                                {code}
                                                            </Select.Option>
                                                        ))}
                                                    </Select>
                                                </Form.Item>
                                            </Col>
                                            <Col span={8} sm={8} xs={24}>
                                                <Form.Item
                                                    label="Họ và tên"
                                                    name={['fullnameChid', index]}
                                                    rules={[{ required: true, message: 'Vui lòng nhập họ và tên của bạn' }]}
                                                >
                                                    <Input
                                                        value={formItem.fullnameChid}
                                                        onChange={(e) => handleInputChangeInfChid(index, 'fullnameChid', e.target.value)}
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col span={8} sm={8} xs={24}>
                                                <Form.Item
                                                    label="Nhập ngày sinh"
                                                    name={['date', index]}
                                                    rules={[{ required: true, message: 'Vui lòng nhập họ và tên của bạn' }]}
                                                    validateStatus={errors[index] ? 'error' : ''}
                                                    help={errors[index]}
                                                >
                                                    <DatePicker
                                                        value={formItem.date ? dayjs(formItem.date) : null}
                                                        onChange={(date, dateString) => handleInputChangeInfChid(index, 'date', dateString)}
                                                        placeholder="Chọn ngày"
                                                    />
                                                </Form.Item>
                                            </Col>

                                        </Row>
                                    ))}
                                    {dataBooking.length > 0 && dataBooking[0].Inf > 0
                                        && <Row>
                                            <div className='contact-header inner'>
                                                <p className='text-15'>Thông tin trẻ em dưới 2 tuổi</p>
                                            </div>
                                        </Row>
                                    }

                                    {formDataInfBaby.map((formItem, index) => (
                                        <Row gutter={[16, 16]} key={index}>
                                            <Col span={24} sm={24} style={{ alignItems: 'center', display: 'flex' }}>
                                                <p style={{ fontWeight: '700' }}>Em bé {index + 1}</p>
                                            </Col>
                                            <Col span={8} sm={8} xs={24}>
                                                <Form.Item
                                                    label="Tiêu đề"
                                                    name={['contentBaby', index]}
                                                    rules={[{ required: true, message: 'Tiêu đề là bắt buộc' }]}
                                                >
                                                    <Select
                                                        value={formItem.contentBaby}
                                                        onChange={(value) => handleInputChangeInfBaby(index, 'contentBaby', value)}
                                                    >
                                                        {contentBaby.map((code) => (
                                                            <Select.Option key={code} value={code}>
                                                                {code}
                                                            </Select.Option>
                                                        ))}
                                                    </Select>
                                                </Form.Item>
                                            </Col>
                                            <Col span={8} sm={8} xs={24}>
                                                <Form.Item
                                                    label="Họ và tên"
                                                    name={['fullnameBaby', index]}
                                                    rules={[{ required: true, message: 'Vui lòng nhập họ và tên của bạn' }]}
                                                >
                                                    <Input
                                                        value={formItem.fullnameBaby}
                                                        onChange={(e) => handleInputChangeInfBaby(index, 'fullnameBaby', e.target.value)}
                                                    />
                                                </Form.Item>
                                            </Col>
                                            <Col span={8} sm={8} xs={24}>
                                                <Form.Item
                                                    label="Nhập ngày sinh"
                                                    name={['dateBaby', index]}
                                                    rules={[{ required: true, message: 'Vui lòng nhập họ và tên của bạn' }]}
                                                    validateStatus={errorsBaby[index] ? 'error' : ''}
                                                    help={errorsBaby[index]}
                                                >
                                                    <DatePicker
                                                        value={formItem.dateBaby ? dayjs(formItem.dateBaby) : null}
                                                        onChange={(date, dateString) => handleInputChangeInfBaby(index, 'dateBaby', dateString)}
                                                        placeholder="Chọn ngày"
                                                    />
                                                </Form.Item>
                                            </Col>
                                        </Row>
                                    ))}
                                </div>
                            </div>
                            <div className='booking-grid-item col-2'>
                                <h3 className='title-page'>Chi tiết liên hệ.</h3>
                                <div className='contact-form'>
                                    <div className='contact-header'>
                                        <p className='text-15'>Chi tiết liên hệ (đối với vé điện tử/Voucher)</p>
                                    </div>
                                    <Row gutter={[16, 16]}>
                                        <Col span={12} sm={12} xs={24}>
                                            <Form.Item
                                                rules={[
                                                    { required: true, message: 'Vui lòng nhập số điện thoại' },
                                                    { pattern: /^\d{8,12}$/, message: 'Số điện thoại không hợp lệ' },
                                                ]}
                                                validateStatus={errorMessages.phone ? 'error' : ''}
                                                help={errorMessages.phone} name="phone" label="Số di động">
                                                <Input
                                                    name='phone'
                                                    type='number'
                                                    addonBefore={
                                                        <Form.Item name="countryCode" noStyle>
                                                            <Select defaultValue="+84">
                                                                {countryCodes.map((code) => (
                                                                    <Option key={code} value={code}>
                                                                        {code}
                                                                    </Option>
                                                                ))}
                                                            </Select>
                                                        </Form.Item>
                                                    }
                                                    onChange={handleInputChange}
                                                />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12} sm={12} xs={24}>
                                            <Form.Item
                                                label="Email"
                                                name="email"
                                                rules={[
                                                    { required: true, message: 'Vui lòng nhập email' },
                                                    { pattern: /^(([a-zA-Z0-9_\-\\.]+)@([a-zA-Z0-9\\-]+\.)+[a-zA-Z]{2,6})$/, message: 'Email không hợp lệ' },
                                                ]}
                                                validateStatus={errorMessages.email ? 'error' : ''}
                                                help={errorMessages.email}
                                            >
                                                <Input name="email" onChange={handleInputChange} />
                                            </Form.Item>
                                        </Col>
                                        <Col span={24} sm={24} style={{marginBottom:'12px'}}>
                                            <Checkbox onChange={(value) => setBill(value.target.checked)}>Yêu cầu xuất hóa đơn</Checkbox>
                                        </Col>
                                        <Col span={12} sm={12} xs={24} style={{ display: bill === false ? 'none' : '' }}>
                                            <Form.Item
                                                label="Mã số thuế"
                                                name="taxCode"
                                                rules={[
                                                    { required: bill, message: 'Vui lòng nhập mã số thuế' },
                                                ]}
                                                validateStatus={bill === true && errorMessages.taxCode ? 'error' : ''}
                                                help={bill === true ? errorMessages.taxCode : ''}
                                            >
                                                <Input name="taxCode" onChange={handleInputChange} />
                                            </Form.Item>
                                        </Col>
                                        <Col span={12} sm={12} xs={24} style={{ display: bill === false ? 'none' : '' }}>
                                            <Form.Item
                                                label="Tên công ty"
                                                name="companyName"
                                                rules={[
                                                    { required: bill, message: 'Vui lòng nhập tên công ty' },
                                                ]}
                                                validateStatus={bill === true && errorMessages.companyName ? 'error' : ''}
                                                help={bill === true ? errorMessages.companyName : ''}
                                            >
                                                <Input name="companyName" onChange={handleInputChange} />
                                            </Form.Item>
                                        </Col>
                                        <Col span={24} sm={24} style={{ display: bill === false ? 'none' : '' }}>
                                            <Form.Item
                                                label="Địa chỉ công ty"
                                                name="companyAddress"
                                                rules={[
                                                    { required: bill, message: 'Vui lòng nhập địa chỉ công ty' },
                                                ]}
                                                validateStatus={bill === true && errorMessages.companyAddress ? 'error' : ''}
                                                help={bill === true ? errorMessages.companyAddress : ''}
                                            >
                                                <Input name="companyAddress" onChange={handleInputChange} />
                                            </Form.Item>
                                        </Col>
                                    </Row>
                                    <div style={{ display: 'flex', flexDirection: 'row', gap: '12px', justifyContent: 'space-between', alignItems: 'center', padding: '12px' }}>
                                        <Button onClick={handleGoBack} type="primary">
                                            Quay lại
                                        </Button>
                                        <Button type="primary" htmlType="submit" onClick={handleSubmitInf}>
                                            Đặt vé
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Form>
                    </div>

                    {dataBooking.length > 0 && <div className='booking-grid-item'>
                        <div className='grid-header-item'>
                            <div className='frame-header-dsc'>
                                <BiSolidPlaneAlt />
                                <p className='header-text text-15'>Chuyến bay</p>
                            </div>
                            <p className='text-15' style={{ color: '#3554d1' }}>Chi tiết</p>
                        </div>
                        {dataBooking.map((element: BookingType, index) => {
                            const totalFee = element.TotalFeeTaxAdt + element.TotalFeeTaxChd + element.TotalFeeTaxInf
                            return (
                                <div className='plane-frame'>
                                    <p className='header-text text-15'><button className='continue'>Chuyến bay {index + 1}</button> • {formatNgayThangNam4(element.StartDate)}</p>
                                    <div className='frame-booking-logo'>
                                        {getAirlineLogo(element.ListSegment[0].Airline, '40px')}
                                        <div className='booking-logo-col'>
                                            <p className='header-text text-15'>
                                                {getAirlineFullName(element.ListSegment[0].Airline)}
                                            </p>
                                            <p className='header-text text-15 blur'>
                                                {element.FlightNumber}
                                            </p>
                                        </div>
                                    </div>
                                    <div className='flex-center-item booking'>
                                        <div className='item-col fix-content'>
                                            <h4 className="searchMenu__title text-truncate">{element.StartTime}</h4>
                                            <p className="filter-item text-truncate">{convertCity(element.StartPoint)} ({element.StartPoint})</p>
                                        </div>
                                        <div className='item-col'>
                                            <div className='frame-time-line'>
                                                <div className='dot left'></div>
                                                <div className='line'></div>
                                                <div className='dot right'></div>
                                            </div>
                                            <p className='filter-item fix-content'>{getNumberOfStops(element)}</p>
                                        </div>
                                        <div className='item-col fix-content'>
                                            <h4 className="searchMenu__title text-truncate">{element.EndTime}</h4>
                                            <p className="filter-item text-truncate">{convertCity(element.EndPoint)} ({element.EndPoint})</p>
                                        </div>
                                    </div>
                                    <div className='frame-price'>
                                        <div className='price-item'>
                                            <p className='title'>Vé người lớn</p>
                                            <p className='title'>{element.Adt} x {element.FareAdt.toLocaleString("vi-VN")} {element.Currency}</p>
                                        </div>
                                        <div className='price-item'>
                                            <p className='title'>Vé người trẻ em</p>
                                            <p className='title'>{element.Chd} x {element.FareChd.toLocaleString("vi-VN")} {element.Currency}</p>
                                        </div>
                                        <div className='price-item'>
                                            <p className='title'>Vé em bé</p>
                                            <p className='title'>{element.Inf} x {element.FareInf.toLocaleString("vi-VN")} {element.Currency}</p>
                                        </div>
                                        <div className='price-item'>
                                            <p className='title'>Tổng thuế và phí</p>
                                            <p className='title'>{totalFee.toLocaleString("vi-VN")} {element.Currency}</p>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                        <div className='plane-frame'>
                            <div className='frame-price'>
                                <div className='price-item'>
                                    <p className='title'>Tổng cộng</p>
                                    <p className='title'>{formatNumber(total)} {dataBooking[0]?.Currency}</p>
                                </div>
                            </div>
                        </div>
                    </div>}
                </div>
            </div>
        </section>
    )
}

export default Booking