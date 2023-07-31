import React, { useState, useMemo, useEffect } from 'react';
import Pagination from './pagination';
import { GoArrowUpRight } from 'react-icons/go'
import './pagination.css'
import { Button, Drawer, Empty, Skeleton, Tabs, TabsProps } from 'antd';
import { ListSegmentType } from 'modal/index';
import { useDispatch, useSelector } from 'react-redux';
import { setBooking, setOutPage, setSelectedItem } from 'store/reducers';
import { convertCity, formatNgayThangNam2, formatNgayThangNam3, getAirlineFullName, getNumberOfStops } from 'utils/custom/custom-format';
import { FaPlaneArrival, FaPlaneDeparture } from 'react-icons/fa';
import { Link } from 'react-router-dom';

interface IProps {
  paginatedData: any[],
  loading: boolean,
  pageRevert: number,
  onNumberChange: any
}

const PaginatedList = (props: IProps) => {

  const { paginatedData, loading, pageRevert, onNumberChange } = props

  const { tripType, selectedItem, listGeoCodeOneTrip, allData, allDataTwo } = useSelector((state: any) => state)

  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage, _] = useState(30);
  const [visibleDropdowns, setVisibleDropdowns] = useState<any>({});
  const [sliceLoadMore, setSliceLoadMore] = useState([])
  const [open, setOpen] = useState(false)
  const [refresh, setRefresh] = useState(0)

  const [openBooking, setOpenBooking] = useState(false)
  const [dataBooking, setDataBooking] = useState<any[]>([])

  const dispatch = useDispatch()


  const existingColumn = 1;
  const paginatedColumn = [];
  for (let i = 0; i < existingColumn; i++) {
    paginatedColumn.push(i);
  }

  const handlePageChange = (selectedPage: number) => {
    setCurrentPage(selectedPage);
  };

  useEffect(() => {
    setCurrentPage(0);
  }, [paginatedData]);

  const pagedItems = useMemo(() => {
    const offset = currentPage * itemsPerPage;
    const startIndex = offset;
    const endIndex = offset + itemsPerPage;
    return paginatedData.slice(startIndex, endIndex);
  }, [currentPage, itemsPerPage, paginatedData]);

  const handleDivClick = (key: any) => {
    setVisibleDropdowns((prevVisibleDropdowns: { [x: string]: any; }) => ({
      ...prevVisibleDropdowns,
      [key]: !prevVisibleDropdowns[key],
    }));
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

  const addNewItem = (item: any) => {
    setOpen(false)
    localStorage.setItem('outPage', JSON.stringify(true));
    dispatch(setOutPage(1))
    setRefresh(prev => prev + 1)
    if (tripType) {
      if (pageRevert === 2) {
        onNumberChange(1);
      } else {
        onNumberChange(2);
      }
      let bookingInf = JSON.parse(localStorage.getItem('bookingInf') || '[]');

      const existingItemIndex = bookingInf.findIndex((element: any) => element.key === item.key);

      if (existingItemIndex !== -1) {
        bookingInf.splice(existingItemIndex, 1, item);
      } else {
        if (bookingInf.length === 2) {
          bookingInf.pop();
        }
        if (item.key === 1) {
          bookingInf.unshift(item);
        } else {
          bookingInf.push(item);
        }
      }
      setDataBooking(bookingInf)
      localStorage.setItem('bookingInf', JSON.stringify(bookingInf));
      dispatch(setBooking(bookingInf))
    } else {
      let bookingInf = JSON.parse(localStorage.getItem('bookingInf') || '[]');
      if (bookingInf.length === 0 || bookingInf[0].Id !== item.Id) {
        setDataBooking([item])
        localStorage.setItem('bookingInf', JSON.stringify([item]));
        dispatch(setBooking([item]))
      }
    }
  };

  function formatNumber(number: number) {
    const roundedNumber = Math.ceil(number / 1000) * 1000;
    const formattedNumber = new Intl.NumberFormat('vi-VN').format(roundedNumber);

    return formattedNumber;
  }

  const onClose = () => {
    setOpen(false);
  };

  const onOpen = (item: any) => {
    setOpen(true)
    dispatch(setSelectedItem(item))
  }

  const onCloseBooking = () => {
    setOpenBooking(false);
  };


  useEffect(() => {
    const existingTripType = tripType
    if (existingTripType === true && dataBooking.length === 2) {
      setOpenBooking(true)
    }
  }, [tripType, dispatch, dataBooking, refresh])

  useEffect(() => {
    const newData: any = paginatedData.slice(0, itemsPerPage)
    setSliceLoadMore(newData)
  }, [itemsPerPage, paginatedData])

  const flattenListAircraft = (response: any) => {
    if (response.ListAircraft && Array.isArray(response.ListAircraft)) {
      return response.ListAircraft;
    }
    return [];
  };

  const airportNameStart = selectedItem && listGeoCodeOneTrip.length > 0 && listGeoCodeOneTrip.find((element: any) => element.AirportCode === selectedItem.StartPoint).AirportName
  const airportNameEnd = selectedItem && listGeoCodeOneTrip.length > 0 && listGeoCodeOneTrip.find((element: any) => element.AirportCode === selectedItem.EndPoint).AirportName

  const flatData = allData.flatMap((response: any) => flattenListAircraft(response)) ?? []

  const uniqueSet = new Set(flatData.map((item: any) => JSON.stringify(item)));
  const uniqueArray = Array.from(uniqueSet).map((item: any) => JSON.parse(item));

  const typePlane = selectedItem && selectedItem.ListSegment[0].Plane && uniqueArray.length > 0
    ? uniqueArray.find((element: any) => element.IATA === selectedItem.ListSegment[0].Plane)?.Manufacturer
    : 'Airbus';

  const flatDataTwo = allDataTwo.flatMap((response: any) => flattenListAircraft(response)) ?? []

  const uniqueSetTwo = new Set(flatDataTwo.map((item: any) => JSON.stringify(item)));
  const uniqueArrayTwo = Array.from(uniqueSetTwo).map((item: any) => JSON.parse(item));

  const typePlaneTwo = selectedItem && selectedItem.ListSegment[0].Plane && uniqueArrayTwo.length > 0
    ? uniqueArrayTwo.find((element: any) => element.IATA === selectedItem.ListSegment[0].Plane)?.Manufacturer
    : 'Airbus'

  const getTypePlaneMap = (item: any) => {
    const typePlane = item && item.ListSegment[0].Plane && uniqueArray.length > 0
      ? uniqueArray.find((element: any) => element.IATA === item.ListSegment[0].Plane)?.Manufacturer
      : 'Airbus';
    return typePlane
  }

  const getAirPortName = (item: any, key: string) => {
    if (key === 'start') {
      const airportNameStart = listGeoCodeOneTrip.length > 0 && listGeoCodeOneTrip.find((element: any) => element.AirportCode === item.StartPoint).AirportName
      return airportNameStart
    } else {
      const airportNameEnd = listGeoCodeOneTrip.length > 0 && listGeoCodeOneTrip.find((element: any) => element.AirportCode === item.EndPoint).AirportName
      return airportNameEnd
    }
  }

  const items: TabsProps['items'] = [
    {
      key: '1',
      label: `Chi tiết chuyến bay`,
      children: <>
        {selectedItem
          &&
          <div className='tab-item-flex-col'>
            <div className='tab-item-row'>
              <span className='trip-type'>{pageRevert === 1 ? 'Chuyến đi' : 'Chuyến về'}</span>
              <span className='text-15'>{getNumberOfStops(selectedItem)}</span>
            </div>
            <div className='tab-item-row'>
              <span className='gr-flex'>
                {getAirlineLogo(selectedItem.Airline, '60px')}
                {getAirlineFullName(selectedItem.ListSegment[0].Airline)}
              </span>
              <span className='gr-flex' style={{ alignItems: 'flex-end' }}>
                <span className='text-15'>Chuyến bay: <strong>{selectedItem.FlightNumber}</strong> </span>
                {pageRevert === 1
                  ? <span className='text-15'>Loại máy bay: <strong>{typePlane && typePlane} {selectedItem.ListSegment[0]?.Plane}</strong> </span>
                  : <span className='text-15'>Loại máy bay: <strong>{typePlaneTwo && typePlaneTwo} {selectedItem.ListSegment[0]?.Plane}</strong> </span>
                }
              </span>
            </div>
            <div className='tab-item-row'>
              <div className='row-plane-trip'>
                <div className='timeline-plane'>
                  <FaPlaneDeparture />
                  <div className='line-frame'>
                    <div className='dot'></div>
                    <div className='line'></div>
                    <div className='dot bottom'></div>
                  </div>
                  <FaPlaneArrival />
                </div>
              </div>
              <div className='plane-trip-inf'>
                <div className='trip-inf-row'>
                  <span className='gr-flex'>
                    <span className='text-15'><strong>{selectedItem.StartTime}</strong> </span>
                    <span className='text-15'>{formatNgayThangNam2(selectedItem.StartDate)}</span>
                  </span>
                  <span className='gr-flex' style={{ alignItems: 'flex-end' }}>
                    <span className='text-15'>{convertCity(selectedItem.StartPoint)} ({selectedItem && selectedItem.StartPoint})</span>
                    <span className='text-14' style={{ color: '#9b9b9b' }}>{airportNameStart}</span>
                  </span>
                </div>
                <div className='trip-inf-row'>
                  <span className='gr-flex'>
                    <span className='text-14' style={{ color: '#3554d1' }}>Thời gian bay {selectedItem.DurationFormat}</span>
                  </span>
                </div>
                <div className='trip-inf-row'>
                  <span className='gr-flex'>
                    <span className='text-15'><strong>{selectedItem.EndTime}</strong> </span>
                    <span className='text-15'>{formatNgayThangNam2(selectedItem.EndDate)}</span>
                  </span>
                  <span className='gr-flex' style={{ alignItems: 'flex-end' }}>
                    <span className='text-15'>{convertCity(selectedItem.EndPoint)} ({selectedItem && selectedItem.EndPoint})</span>
                    <span className='text-14' style={{ color: '#9b9b9b' }}>{airportNameEnd}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        }
      </>,
    },
    {
      key: '2',
      label: `Hành lý & điều kiện vé`,
      children: `Điều kiện`,
    },
  ];

  const Bookingitems: TabsProps['items'] = dataBooking.map((element, index) => (
    {
      key: String(index),
      label: `Chuyến ${dataBooking.length > 0 && index === 0 ? `đi` : 'về'}`,
      children: (
        <>
          <div className='tab-item-flex-col'>
            <h3 className='title-drawer'>
              {convertCity(element.StartPoint)} ({element.StartPoint}) - {convertCity(element.EndPoint)} ({element.EndPoint})
            </h3>
            <div className='tab-item-row'>
              <span className='trip-type'>{element.FlightNumber}</span>
              <span className='text-15'>{getNumberOfStops(element)}</span>
            </div>
            <div className='tab-item-row'>
              <span className='gr-flex'>
                {getAirlineLogo(element.Airline, '60px')}
                {getAirlineFullName(element.ListSegment[0].Airline)}
              </span>
              <span className='gr-flex' style={{ alignItems: 'flex-end' }}>
                <span className='text-15'>Chuyến bay: <strong>{element.FlightNumber}</strong> </span>
                <span className='text-15'>Loại máy bay: <strong>{getTypePlaneMap(element)} {element.ListSegment[0]?.Plane}</strong> </span>
              </span>
            </div>
            <div className='tab-item-row'>
              <div className='row-plane-trip'>
                <div className='timeline-plane'>
                  <FaPlaneDeparture />
                  <div className='line-frame'>
                    <div className='dot'></div>
                    <div className='line'></div>
                    <div className='dot bottom'></div>
                  </div>
                  <FaPlaneArrival />
                </div>
              </div>
              <div className='plane-trip-inf'>
                <div className='trip-inf-row'>
                  <span className='gr-flex'>
                    <span className='text-15'><strong>{element.StartTime}</strong> </span>
                    <span className='text-15'>{formatNgayThangNam2(element.StartDate)}</span>
                  </span>
                  <span className='gr-flex' style={{ alignItems: 'flex-end' }}>
                    <span className='text-15'>{convertCity(element.StartPoint)} ({element.StartPoint})</span>
                    <span className='text-14' style={{ color: '#9b9b9b' }}>{getAirPortName(element, 'start')}</span>
                  </span>
                </div>
                <div className='trip-inf-row'>
                  <span className='gr-flex'>
                    <span className='text-14' style={{ color: '#3554d1' }}>Thời gian bay {element.DurationFormat}</span>
                  </span>
                </div>
                <div className='trip-inf-row'>
                  <span className='gr-flex'>
                    <span className='text-15'><strong>{element.EndTime}</strong> </span>
                    <span className='text-15'>{formatNgayThangNam2(element.EndDate)}</span>
                  </span>
                  <span className='gr-flex' style={{ alignItems: 'flex-end' }}>
                    <span className='text-15'>{convertCity(element.EndPoint)} ({element.EndPoint})</span>
                    <span className='text-14' style={{ color: '#9b9b9b' }}>{getAirPortName(element, 'end')}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      ),
    }
  ));

  const total = dataBooking.reduce((num, cur) =>
    num +=
    (cur.FareAdt * cur.Adt + cur.FareChd * cur.Chd + cur.FareInf * cur.Inf + cur.TotalFeeTaxAdt + cur.TotalFeeTaxChd + cur.TotalFeeTaxInf)
    , 0)

  return (
    <>
      <Drawer
        className='drawer-class-paginated'
        placement={'right'}
        closable={true}
        onClose={onClose}
        width={'fit-content'}
        // width={window.innerWidth > 900 ? 800 : window.innerWidth - 100}
        open={open}
        footer={<div className='tab-footer'>
          <span className='gr-flex'>
            <span className='text-15' style={{ fontWeight: '400' }}>Tổng chi phí tạm tính</span>
            <span className='text-13' style={{ color: '#9b9b9b' }}>(Đã bao gồm Thuế và phí)</span>
          </span>
          <span className='text-15' style={{ fontWeight: '500' }}>{selectedItem && selectedItem.TotalPriceFormat.toLocaleString("vi-VN")} {selectedItem && selectedItem.Currency}</span>
          {selectedItem && tripType === true
            ? <button className={'view-deal'} onClick={() => addNewItem({
              key: pageRevert,
              Id: selectedItem.Id,
              Airline: selectedItem.Airline,
              Adt: selectedItem.Adt,
              Chd: selectedItem.Chd,
              Inf: selectedItem.Inf,
              Currency: selectedItem.Currency,
              EndDate: selectedItem.EndDate,
              EndPoint: selectedItem.EndPoint,
              EndTime: selectedItem.EndTime,
              FlightNumber: selectedItem.FlightNumber,
              ListSegment: selectedItem.ListSegment.map((item: ListSegmentType) => {
                return {
                  Airline: item.Airline,
                  AllowanceBaggage: item.AllowanceBaggage,
                  Cabin: item.Cabin,
                  Class: item.Class,
                  HandBaggage: item.HandBaggage
                }
              }),
              StartDate: selectedItem.StartDate,
              StartPoint: selectedItem.StartPoint,
              StartTime: selectedItem.StartTime,
              FareAdt: selectedItem.FareAdt,
              FareChd: selectedItem.FareChd,
              FareInf: selectedItem.FareInf,
              TotalFeeTaxAdt: selectedItem.TotalFeeTaxAdt,
              TotalFeeTaxChd: selectedItem.TotalFeeTaxChd,
              TotalFeeTaxInf: selectedItem.TotalFeeTaxInf,
            })}>
              Chọn
              <GoArrowUpRight />
            </button>
            : <Link to={'/booking'}>
              <button className={'view-deal'} onClick={() => addNewItem({
                key: pageRevert,
                Id: selectedItem.Id,
                Airline: selectedItem.Airline,
                Adt: selectedItem.Adt,
                Chd: selectedItem.Chd,
                Inf: selectedItem.Inf,
                Currency: selectedItem.Currency,
                EndDate: selectedItem.EndDate,
                EndPoint: selectedItem.EndPoint,
                EndTime: selectedItem.EndTime,
                FlightNumber: selectedItem.FlightNumber,
                ListSegment: selectedItem.ListSegment.map((item: ListSegmentType) => {
                  return {
                    Airline: item.Airline,
                    AllowanceBaggage: item.AllowanceBaggage,
                    Cabin: item.Cabin,
                    Class: item.Class,
                    HandBaggage: item.HandBaggage
                  }
                }),
                StartDate: selectedItem.StartDate,
                StartPoint: selectedItem.StartPoint,
                StartTime: selectedItem.StartTime,
                FareAdt: selectedItem.FareAdt,
                FareChd: selectedItem.FareChd,
                FareInf: selectedItem.FareInf,
                TotalFeeTaxAdt: selectedItem.TotalFeeTaxAdt,
                TotalFeeTaxChd: selectedItem.TotalFeeTaxChd,
                TotalFeeTaxInf: selectedItem.TotalFeeTaxInf,
              })}>
                Chọn
                <GoArrowUpRight />
              </button>
            </Link>
          }
        </div>}
      >
        <div className='flex-col'>
          <h3 className='title-drawer'>
            {selectedItem && convertCity(selectedItem.StartPoint)} ({selectedItem && selectedItem.StartPoint}) - {selectedItem && convertCity(selectedItem.EndPoint)} ({selectedItem && selectedItem.EndPoint})
          </h3>
          <Tabs defaultActiveKey="1" items={items} />
        </div>
      </Drawer>
      <Drawer
        className='drawer-class-paginated'
        placement={'right'}
        closable={true}
        onClose={onCloseBooking}
        width={'fit-content'}
        open={openBooking}
        footer={<div className='tab-footer'>
          <span className='gr-flex'>
            <span className='text-15' style={{ fontWeight: '400' }}>Tổng chi phí tạm tính</span>
            <span className='text-13' style={{ color: '#9b9b9b' }}>(Đã bao gồm Thuế và phí)</span>
          </span>
          <span className='text-15' style={{ fontWeight: '500' }}>{total.toLocaleString("vi-VN")} VNĐ</span>
          <Link to={'/booking'}>
            <button className='continue'>Tiếp tục</button>
          </Link>
        </div>}
      >
        <div className='flex-col'>
          <Tabs defaultActiveKey="1" items={Bookingitems} />
        </div>
      </Drawer>
      <div className='paginated-main'>

        <div className='paginated-row grid-container'>
          {loading
            ? <Skeleton avatar paragraph={{ rows: 4 }} style={{ gridColumn: 'span 2 / span 2' }} active />
            : pagedItems.length > 0 ? pagedItems
              .map((element: any, index: number) => {
                // const isActive = bookingInf.some((ele) => String(ele.Id) === String(element.Id))
                return (
                  <div className='paginated-item items' key={`element_${index}`}>
                    <div className='frame-item-col'>
                      <div className='item-flex' onClick={() => handleDivClick(index)}>
                        {getAirlineLogo(element.Airline, '60px')}
                        <div className='flex-center-item'>
                          <div className='item-col fix-content'>
                            <h4 className="searchMenu__title text-truncate">{element.StartTime}</h4>
                            <p className="filter-item text-truncate">{element.StartPoint}</p>
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
                            <p className="filter-item text-truncate">{element.EndPoint}</p>
                          </div>
                        </div>
                        <p className="filter-item fix-content">{element.FlightNumber}</p>
                      </div>
                      <Button className='detail' style={{ maxWidth: 'fit-content' }} onClick={() => onOpen(element)}>Chi tiết</Button>
                    </div>
                    <div className='item-col-1'>
                      <h3 className='text-18 text-truncate'>{formatNumber(element.FareAdtFull)} {element.Currency}</h3>
                      {/* <p className="filter-item text-truncate">16 deals</p> */}
                      {tripType === true
                        ? <button className={'view-deal'} onClick={() => addNewItem({
                          key: pageRevert,
                          Id: element.Id,
                          Airline: element.Airline,
                          Adt: element.Adt,
                          Chd: element.Chd,
                          Inf: element.Inf,
                          Currency: element.Currency,
                          EndDate: element.EndDate,
                          EndPoint: element.EndPoint,
                          EndTime: element.EndTime,
                          FlightNumber: element.FlightNumber,
                          ListSegment: element.ListSegment.map((item: ListSegmentType) => {
                            return {
                              Airline: item.Airline,
                              AllowanceBaggage: item.AllowanceBaggage,
                              Cabin: item.Cabin,
                              Class: item.Class,
                              HandBaggage: item.HandBaggage
                            }
                          }),
                          StartDate: element.StartDate,
                          StartPoint: element.StartPoint,
                          StartTime: element.StartTime,
                          FareAdt: element.FareAdt,
                          FareChd: element.FareChd,
                          FareInf: element.FareInf,
                          TotalFeeTaxAdt: element.TotalFeeTaxAdt,
                          TotalFeeTaxChd: element.TotalFeeTaxChd,
                          TotalFeeTaxInf: element.TotalFeeTaxInf,
                        })}>
                          Chọn
                          <GoArrowUpRight />
                        </button>
                        : <Link to={'/booking'}>
                          <button className={'view-deal'} onClick={() => addNewItem({
                            key: pageRevert,
                            Id: element.Id,
                            Airline: element.Airline,
                            Adt: element.Adt,
                            Chd: element.Chd,
                            Inf: element.Inf,
                            Currency: element.Currency,
                            EndDate: element.EndDate,
                            EndPoint: element.EndPoint,
                            EndTime: element.EndTime,
                            FlightNumber: element.FlightNumber,
                            ListSegment: element.ListSegment.map((item: ListSegmentType) => {
                              return {
                                Airline: item.Airline,
                                AllowanceBaggage: item.AllowanceBaggage,
                                Cabin: item.Cabin,
                                Class: item.Class,
                                HandBaggage: item.HandBaggage
                              }
                            }),
                            StartDate: element.StartDate,
                            StartPoint: element.StartPoint,
                            StartTime: element.StartTime,
                            FareAdt: element.FareAdt,
                            FareChd: element.FareChd,
                            FareInf: element.FareInf,
                            TotalFeeTaxAdt: element.TotalFeeTaxAdt,
                            TotalFeeTaxChd: element.TotalFeeTaxChd,
                            TotalFeeTaxInf: element.TotalFeeTaxInf,
                          })}>
                            Chọn
                            <GoArrowUpRight />
                          </button>
                        </Link>
                      }

                    </div>
                  </div>
                )
              })
              : <Empty description={'Không tìm thấy chuyến bay bạn yêu cầu.'} style={{ gridColumn: 'span 2 / span 2' }} />
          }
        </div>
      </div>
      <Pagination
        pageCount={Math.ceil(paginatedData.length / itemsPerPage)}
        onPageChange={handlePageChange}
        initialPage={currentPage}
      />
    </>
  );
};
export default PaginatedList;
