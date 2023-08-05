import React, { useEffect, useState } from "react";
import './thanks-you.css'
import { formatDayByDateNoT, formatTimeByDate, getAirlineLogo, getCiTy } from "utils/custom/custom-format";
import axios from "axios";
import { Tabs } from "antd";
import dayjs from "dayjs";

const ThanksYou = () => {

    const [ticketInf, setTicketInf] = useState(null)
    const [ticketInfMap, setTicketInfMap] = useState<any[]>([])
    const [listPassenger, setListPassenger] = useState([])
    const [QRURL, setQRURL] = useState('')
    const [bookingCode, setBookingCode] = useState<any>(null)
    const [amount, setAmount] = useState(0)

    useEffect(() => {
        const isArrayLocal = localStorage.getItem('bookingFn')
        if (isArrayLocal) {
            const data = JSON.parse(isArrayLocal)
            setTicketInf(data)
            setTicketInfMap(data.listFareData)
            setListPassenger(data.listPassenger)
            const resultObject: any = {};
            resultObject["key1"] = data.listFareData[0].bookingCode;
            if (data.listFareData.length > 1) {
                resultObject["keys2"] = data.listFareData[1].bookingCode;
            }
            setBookingCode(resultObject)
            const amount = data.listFareData.reduce((num: number, cur: any) =>
                num +=
                (((cur.fareAdt + cur.feeAdt + cur.serviceFeeAdt + cur.taxAdt) * cur.adt)
                    + ((cur.fareChd + cur.feeChd + cur.serviceFeeChd + cur.taxChd) * cur.chd)
                    + ((cur.fareInf + cur.feeInf + cur.serviceFeeInf + cur.taxInf) * cur.inf))
                , 0)
            setAmount(amount)
        }
    }, [])

    useEffect(() => {
        const fetchBank = async () => {
            const existingValue = amount
            const data = {
                "accountNo": 19027635064028,
                "accountName": "HUYNH PHUOC MAN",
                "acqId": 970407,
                "amount": existingValue,
                "addInfo": `${(bookingCode && bookingCode.key1) ? bookingCode.key1 : ''} ${(bookingCode && bookingCode.key2) ? bookingCode.key2 : ''}`,
                "format": "text",
                "template": "lzlVuTE"
            }
            const res = await axios.post('https://api.vietqr.io/v2/generate', data)
            setQRURL(res.data.data.qrDataURL)
        }
        fetchBank()
    }, [amount, bookingCode, ticketInfMap])

    const mergedArray = listPassenger.flatMap((obj: any) => obj.listBaggage)
    const stringValueFrom = ticketInfMap.length > 0
        ? `${ticketInfMap[0].listFlight[0].startPoint + ticketInfMap[0].listFlight[0].endPoint}`
        : ''
    const stringValueFrom2 = ticketInfMap.length > 0
        ? `${ticketInfMap[0].listFlight[0].startPoint}-${ticketInfMap[0].listFlight[0].endPoint}`
        : ''
    const stringValueTo = ticketInfMap.length > 1 ? `${ticketInfMap[0].listFlight[0].startPoint + ticketInfMap[0].listFlight[0].endPoint}` : ''
    const stringValueTo2 = ticketInfMap.length > 1 ? `${ticketInfMap[0].listFlight[0].startPoint}-${ticketInfMap[0].listFlight[0].endPoint}` : ''
    const mergedArrayFrom = mergedArray.filter((element: any) => element.route === stringValueFrom || element.route === stringValueFrom2)
    const mergedArrayTo = mergedArray.filter((element: any) => element.route === stringValueTo || element.route === stringValueTo2)
    const totalBaggageFrom = mergedArrayFrom.reduce((num, cur: any) => num += Number(cur.value), 0)
    const totalBaggageTo = mergedArrayTo.reduce((num, cur: any) => num += Number(cur.value), 0)

    return (
        <section className='thanks-section'>
            <div className="thanks-container">
                <h3 className="title-info">Thông tin vé của bạn.</h3>
                <Tabs
                    defaultActiveKey="1"
                    centered
                    items={ticketInfMap.map((ticket: any, i) => {
                        const id = String(i + 1);
                        return {
                            label: `Vé chuyến ${i === 0 ? 'đi' : 'về'}`,
                            key: id,
                            children: <div className="ticket-information">
                                <h3 className="title-info">Cần thanh toán trước <p className="inf-dsc" style={{ fontWeight: '400' }}>{dayjs(ticket.expiredDate).format('HH:mm:ss [ngày] DD [tháng] MM [năm] YYYY')}</p></h3>
                                <div className="header-ticket">
                                    <div className="frame-logo">
                                        {/* <p className="logo-title">{ticket.airlineName}</p> */}
                                        {getAirlineLogo(ticket.airline, '160px')}
                                    </div>
                                </div>
                                <div className="body-ticket">
                                    <div className="ticket-inf-item">
                                        <h3 className="inf-title">HỌ VÀ TÊN / NAME</h3>
                                        <ol>
                                            {
                                                listPassenger.length > 0 && listPassenger.map((passenger: any) => (
                                                    <li>{passenger.lastName} {passenger.firstName}</li>
                                                ))
                                            }
                                        </ol>
                                    </div>
                                    <div className="ticket-inf-item col-2">
                                        <div className="flex-row-inf">
                                            <div>
                                                <h3 className="inf-title">MÃ ĐẶT CHỖ / PNR</h3>
                                                <p className="inf-dsc">{ticket.bookingCode}</p>
                                            </div>
                                        </div>
                                        <div className="flex-row-inf" style={{ justifyContent: 'center' }}>
                                            <h3 className="inf-title" style={{ fontSize: '16px' }}>THÔNG TIN CHUYẾN BAY</h3>
                                        </div>
                                        <div className="flex-row-inf">
                                            <h3 className="inf-title">CHUYẾN BAY / FLIGHT</h3>
                                            <p className="inf-dsc">{ticket.listFlight[0].flightNumber}</p>
                                        </div>
                                        <div className="flex-row-inf">
                                            <h3 className="inf-title">NƠI ĐI / FROM</h3>
                                            <p className="inf-dsc">{getCiTy(ticket.listFlight[0].startPoint)}</p>
                                        </div>
                                        <div className="flex-row-inf">
                                            <h3 className="inf-title">NƠI ĐẾN / TO</h3>
                                            <p className="inf-dsc">{getCiTy(ticket.listFlight[0].endPoint)}</p>
                                        </div>
                                        <div className="flex-row-inf">
                                            <h3 className="inf-title">KHỞI HÀNH / DEPARTING AT</h3>
                                            <p className="inf-dsc">{formatTimeByDate(ticket.listFlight[0].startDate)}</p>
                                        </div>
                                        <div className="flex-row-inf">
                                            <h3 className="inf-title">GIỜ ĐẾN / ARRIVING AT</h3>
                                            <p className="inf-dsc">{formatTimeByDate(ticket.listFlight[0].endDate)}</p>
                                        </div>
                                        <div className="flex-row-inf">
                                            <h3 className="inf-title">NGÀY / DATE</h3>
                                            <p className="inf-dsc">{formatDayByDateNoT(ticket.listFlight[0].startDate)}</p>
                                        </div>
                                    </div>
                                    <div className="ticket-inf-item">
                                        <h3 className="inf-title" style={{ textAlign: 'center' }}>THANH TOÁN / PAYMENT</h3>
                                        <div className="flex-row-inf" style={{ justifyContent: 'center' }}>
                                            <h3 className="inf-title">0 VNĐ</h3>
                                        </div>
                                        <div className="flex-row-inf" style={{ justifyContent: 'center' }}>
                                            <h3 className="inf-title">DỊCH VỤ CỘNG THÊM</h3>
                                        </div>
                                        <div className="flex-row-inf">
                                            <h3 className="inf-title">HÀNH LÝ / BAGGAGE</h3>
                                            <p className="inf-dsc">{i === 0 ? totalBaggageFrom : totalBaggageTo} Kg</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="warnning">
                                    <div className="warnning-item">
                                        <p className="warnning-dsc">Quý khách vui lòng mang theo đầỳ đủ <strong>giấy tờ tùy thân</strong></p>
                                    </div>
                                    <div className="warnning-item" style={{ borderRight: '1px solid #e0e7ff', borderLeft: '1px solid #e0e7ff' }}>
                                        <p className="warnning-dsc">Có mặt tại sân bay ít nhất <br /> <strong>2 tiếng trước giờ khởi hành</strong></p>
                                    </div>
                                    <div className="warnning-item">
                                        <p className="warnning-dsc">Ngày trên vé, được tính <strong>theo giờ địa phương</strong></p>
                                    </div>
                                </div>
                                <div className="header-ticket" style={{ justifyContent: 'flex-end' }}>
                                    <div className="frame-logo">
                                        {/* <p className="logo-title">{ticket.airlineName}</p> */}
                                        {getAirlineLogo(ticket.airline, '160px')}
                                    </div>
                                </div>
                            </div>,
                        };
                    })}
                />
                <h3 className="title-info">Thông tin thanh toán.</h3>
                <div className="qr-item">
                    <img src={QRURL} className="image-qr" alt="" />
                    <div className="qr-inf">
                        <img className="img-qr naspas" src='media/logo/napas.png' alt="" />
                        <div className="qr-line"></div>
                        <img className="img-qr" src='media/logo/Logo-TCB-H.webp' alt="" />
                    </div>
                    <h3 className="title-info" style={{ margin: '0', fontWeight: '400' }}>HUYNH PHUOC MAN</h3>
                    <h3 className="title-info" style={{ margin: '0', fontWeight: '400' }}>19027635064028</h3>
                    <h3 className="title-info" style={{ margin: '0', fontWeight: '400' }}>Số tiền: {amount.toLocaleString('vn')} VNĐ</h3>
                    {(bookingCode && bookingCode.key1 != null) && <h3 className="title-info" style={{ margin: '0', fontWeight: '400' }}>Nội dung chuyển khoản: {(bookingCode && bookingCode.key1) ? bookingCode.key1 : ''} {(bookingCode && bookingCode.key2) ? bookingCode.key2 : ''}</h3>}

                </div>
            </div>
        </section>
    )
}

export default ThanksYou