import React, { useState, useMemo, useEffect } from 'react';
import Pagination from './pagination';
import { GoArrowUpRight } from 'react-icons/go'
import './pagination.css'
import { Button, Drawer, Empty, Skeleton, Tabs, TabsProps } from 'antd';
import { ListSegmentType } from 'modal/index';
import { useDispatch, useSelector } from 'react-redux';
import { setBooking, setOutPage, setSelectedItem } from 'store/reducers';
import { convertCity, formatNgayThangNam2, formatNgayThangNam3, getNumberOfStops } from 'utils/custom/custom-format';
import { FaPlaneArrival, FaPlaneDeparture } from 'react-icons/fa';

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
  const [itemsPerPage, setItemPerPage] = useState(5);
  const [visibleDropdowns, setVisibleDropdowns] = useState<any>({});
  const [sliceLoadMore, setSliceLoadMore] = useState([])
  const [open, setOpen] = useState(false)

  const dispatch = useDispatch()


  const existingColumn = 1;
  const paginatedColumn = [];
  for (let i = 0; i < existingColumn; i++) {
    paginatedColumn.push(i);
  }

  const handlePageChange = (selectedPage: number) => {
    setCurrentPage(selectedPage);
  };

  const offset = currentPage * itemsPerPage;
  const pagedItems = useMemo(() => {
    const startIndex = offset;
    const endIndex = offset + itemsPerPage;
    return paginatedData.slice(startIndex, endIndex);
  }, [offset, itemsPerPage, paginatedData]);



  const getAirlineFullName = (abbr: string) => {
    switch (abbr) {
      case 'VJ':
        return 'Vietjet Air';
      case 'VN':
        return 'Vietnam Airlines';
      case 'QH':
        return 'Bamboo Airways';
      case 'VU':
        return 'Vietravel';
      default:
        return abbr;
    }
  };


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
    localStorage.setItem('outPage', JSON.stringify(true));
    dispatch(setOutPage(1))
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

      localStorage.setItem('bookingInf', JSON.stringify(bookingInf));
      dispatch(setBooking(bookingInf))
    } else {
      let bookingInf = JSON.parse(localStorage.getItem('bookingInf') || '[]');
      if (bookingInf.length === 0 || bookingInf[0].Id !== item.Id) {
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

  const flatData = allData.flatMap((response: any) => flattenListAircraft(response))

  const uniqueSet = new Set(flatData.map((item: any) => JSON.stringify(item)));
  const uniqueArray = Array.from(uniqueSet).map((item: any) => JSON.parse(item));

  const typePlane = selectedItem && uniqueArray.length > 0 && uniqueArray.find((element: any) => element.IATA === selectedItem.ListSegment[0].Plane).Manufacturer

  const flatDataTwo = allDataTwo.flatMap((response: any) => flattenListAircraft(response))

  const uniqueSetTwo = new Set(flatDataTwo.map((item: any) => JSON.stringify(item)));
  const uniqueArrayTwo = Array.from(uniqueSetTwo).map((item: any) => JSON.parse(item));

  const typePlaneTwo = selectedItem && uniqueArrayTwo.length > 0 && uniqueArrayTwo.find((element: any) => element.IATA === selectedItem.ListSegment[0].Plane).Manufacturer

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
                  ? <span className='text-15'>Loại máy bay: <strong>{typePlane && typePlane} {selectedItem.ListSegment[0].Plane}</strong> </span>
                  : <span className='text-15'>Loại máy bay: <strong>{typePlaneTwo && typePlaneTwo} {selectedItem.ListSegment[0].Plane}</strong> </span>
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


  return (
    <>
      <div className='paginated-main'>
        <Drawer
          className='drawer-class-paginated'
          placement={'right'}
          closable={true}
          onClose={onClose}
          width={'fit-content'}
          open={open}
          footer={<div className='tab-footer'>
            <span className='gr-flex'>
              <span className='text-15' style={{ fontWeight: '400' }}>Tổng chi phí tạm tính</span>
              <span className='text-13' style={{ color: '#9b9b9b' }}>(Đã bao gồm Thuế và phí)</span>
            </span>
            <span className='text-15' style={{ fontWeight: '400' }}>{selectedItem && selectedItem.TotalPriceFormat} {selectedItem && selectedItem.Currency}</span>
          </div>}
        >
          <div className='flex-col'>
            <h3 className='title-drawer'>
              {selectedItem && convertCity(selectedItem.StartPoint)} ({selectedItem && selectedItem.StartPoint}) - {selectedItem && convertCity(selectedItem.EndPoint)} ({selectedItem && selectedItem.EndPoint})
            </h3>
            <Tabs defaultActiveKey="1" items={items} />
          </div>
        </Drawer>
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
                      {/* <Dropdown overlay={() => {
                        const convert = dataCountry.find((city) => element.StartPoint === city.code)?.city ?? ''
                        const convertEnd = dataCountry.find((city) => element.EndPoint === city.code)?.city ?? ''
                        const totalPrice = element.Adt * element.FareAdt + element.Chd * element.FareChd + element.Inf * element.FareInf + element.TotalFeeTaxAdt
                        return (
                          <div className='frame-dropdown'>
                            <div className='layout-left'>
                              <div className='dot'></div>
                              <div className='line'></div>
                              <div className='dot-bold'></div>
                            </div>
                            <div className='div-flex-row'>
                              <div className='layout-right'>
                                <h3 className='dropdown-city'>{convert} ({element.StartPoint})</h3>
                                <div className='flex-row'>
                                  <h3 className='dropdown-city'>{getAirlineFullName(element.Airline)}</h3>
                                  {getAirlineLogo(element.Airline, '40px')}
                                </div>
                                <div className='flex-row'>
                                  <h3 className='dropdown-city'>
                                    {element.FlightNumber}
                                  </h3> {element.Promo ? '-' : null} <h3 className='dropdown-city'>
                                    {element.Promo === true ? 'Promo' : null}
                                  </h3>
                                </div>
                                <div className='info-air'>
                                  <div className='flex-row-info'>
                                    <FiBriefcase />
                                    <div className='info-col'>
                                      <span>Baggage {element.ListSegment[0].HandBaggage}</span>
                                      <span>Cabin {element.ListSegment[0].Cabin}</span>
                                    </div>
                                  </div>
                                  <div className='flex-row-info'>
                                    <PiWarningCircleThin />
                                    <div className='info-col'>
                                      <span>Airbus {element.FlightNumber}</span>
                                    </div>
                                  </div>
                                </div>
                                <div className='info-air'>
                                  <div className='flex-row-info'>
                                    <VscSymbolClass />
                                    <div className='info-col'>
                                      <span>Class {element.ListSegment[0].Class}</span>
                                    </div>
                                  </div>
                                </div>
                                <h3 className='dropdown-city'>{convertEnd} ({element.EndPoint})</h3>
                              </div>
                              <div className='layout-right'>
                                <div style={{
                                  display: 'flex',
                                  width: '100%',
                                  paddingBottom: '12px',
                                  borderBottom: '1px solid black',
                                  flexDirection: 'column',
                                  gap: '12px'
                                }}>
                                  <h3 className='dropdown-city' style={{ textAlign: 'center' }}>Hành lý bao gồm</h3>
                                  <div className='flex-row'>
                                    <h3 className='dropdown-city'>01 kiện {element.ListSegment[0].HandBaggage} xách tay</h3>
                                  </div>
                                  <div className='flex-row'>
                                    <h3 className='dropdown-city'>
                                      01 kiện {element.ListSegment[0].AllowanceBaggage} kí gửi
                                    </h3> {element.Promo ? '-' : null} <h3 className='dropdown-city'>
                                      {element.Promo === true ? 'Promo' : null}
                                    </h3>
                                  </div>
                                </div>
                                <div style={{
                                  display: 'flex',
                                  width: '100%',
                                  paddingBottom: '12px',
                                  flexDirection: 'column',
                                  gap: '12px'
                                }}>
                                  <h3 className='dropdown-city' style={{ textAlign: 'center' }}>Tóm tắt giá vé</h3>
                                  <div className='flex-row' style={{ justifyContent: 'space-between' }}>
                                    <h3 className='dropdown-city'>{element.Adt} người lớn</h3>
                                    <h3 className='dropdown-city'>{element.Adt} x {element.FareAdtFormat} {element.Currency}</h3>
                                  </div>
                                  <div className='flex-row' style={{ justifyContent: 'space-between' }}>
                                    <h3 className='dropdown-city'>{element.Chd} trẻ em</h3>
                                    <h3 className='dropdown-city'>{element.Chd} x {element.FareChdFormat} {element.Currency}</h3>
                                  </div>
                                  <div className='flex-row' style={{ justifyContent: 'space-between' }}>
                                    <h3 className='dropdown-city'>{element.Inf} em bé</h3>
                                    <h3 className='dropdown-city'>{element.Inf} x {element.FareInfFormat} {element.Currency}</h3>
                                  </div>
                                  <div className='flex-row' style={{ justifyContent: 'space-between' }}>
                                    <h3 className='dropdown-city'>Tổng thuế và phí</h3>
                                    <h3 className='dropdown-city'>{element.TotalFeeTaxAdt} {element.Currency}</h3>
                                  </div>
                                  <div className='flex-row' style={{ justifyContent: 'space-between' }}>
                                    <h3 className='dropdown-city'>Tổng cộng</h3>
                                    <h3 className='dropdown-city'>{formatNumber(totalPrice)} {element.Currency}</h3>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      }
                      } visible={visibleDropdowns[index]} onVisibleChange={(flag) => handleDropdownVisibleChange(index, flag)} className='hover-dropdown' trigger={['click']} arrow>
                        <Button className='detail'>Chi tiết <RiArrowDropDownLine /></Button>
                      </Dropdown> */}
                      <Button className='detail' style={{ maxWidth: 'fit-content' }} onClick={() => onOpen(element)}>Chi tiết</Button>
                    </div>
                    <div className='item-col-1'>
                      <h3 className='text-18 text-truncate'>{formatNumber(element.FareAdtFull)} {element.Currency}</h3>
                      {/* <p className="filter-item text-truncate">16 deals</p> */}
                      <button className={'view-deal'} onClick={() => addNewItem({
                        key: pageRevert,
                        Id: element.Id,
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
                    </div>
                  </div>
                )
              })
              : <Empty description={'Không tìm thấy chuyến bay bạn yêu cầu.'} style={{ gridColumn: 'span 2 / span 2' }} />
          }
          {/* {itemsPerPage <= paginatedData.length &&
            <div className='paginated-item'>
              <p style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
                gridColumn: 'span 5 / span 5',
                textAlign: 'center',
                cursor: 'pointer'
              }} onClick={() => setItemPerPage(prev => prev + 5)}>Load more</p>
            </div>

          } */}
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
