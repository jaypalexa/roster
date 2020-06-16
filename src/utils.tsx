import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import Delete from '@material-ui/icons/Delete';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Pageview from '@material-ui/icons/Pageview';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import ReportOptionsDateRangeDto from 'dtos/ReportOptions/ReportOptionsDateRangeDto';
import moment from 'moment';
import React, { forwardRef, RefObject } from "react";

export interface Dictionary<T> {
  [key: string]: T;
};

export const sortByProperty = (propertyName: string) => {
  const value = (x: any) => x[propertyName];
  return (a: any, b: any) => {
    const value_a = value(a);
    const value_b = value(b);
    return (((value_a > value_b) as any) - ((value_b > value_a) as any));
  }
};

export const sortByPropertyDesc = (propertyName: string) => {
  const value = (x: any) => x[propertyName];
  return (a: any, b: any) => {
    const value_a = value(a);
    const value_b = value(b);
    return (((value_b > value_a) as any) - ((value_a > value_b) as any));
  }
};

export const toNumber = (value: any): number => value ? Number(value || 0) : value;

export const constants = Object.freeze({
  ERROR: Object.freeze({
    GENERIC :'ERROR (see browser console for details)',
  }),
  INPUT_NUMBER_PATTERN: Object.freeze({
    ZERO_DECIMAL_PLACES :'\\d+',
    TWO_DECIMAL_PLACES:'^\\d+\\.?\\d{0,2}$',
  }),
  REPORTS: Object.freeze({
    NO_ITEMS_FOUND :'No records meet the specified criteria.',
  }),
});

/* focus trap to prevent leaving modal dialog when tabbing around */
export const handleModalKeyDownEvent = (e: KeyboardEvent) => {
  if (e.keyCode === 9) { // TAB KEY
    const modalDialog = document.querySelector('.modal') as HTMLElement;
    const focusableElements = modalDialog.querySelectorAll('input,button,select,textarea');
    if (focusableElements.length) {
      const firstElement = focusableElements[0] as HTMLElement;
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;
      if (e.shiftKey) {
        if (e.target === firstElement) { // shift-tab pressed on first input in dialog
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (e.target === lastElement) { // tab pressed on last input in dialog
          firstElement.focus();
          e.preventDefault();
        }
      }
    }
  }
};

export const isIphone = /(iPhone)/i.test(navigator.userAgent);
export const isIosDevice = /(iPad|iPhone|iPod)/g.test(navigator.userAgent) && !window.MSStream;
export const isSafari = !!navigator.userAgent.match(/Version\/[\\d\\.]+.*Safari/);

export const actionIcons = {
  EditIcon: Edit,
  DeleteIcon: Delete,
  ViewIcon: Pageview,
};

export const tableIcons = {
  Add: forwardRef((props, ref: ((instance: SVGSVGElement | null) => void) | RefObject<SVGSVGElement> | null | undefined) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref: ((instance: SVGSVGElement | null) => void) | RefObject<SVGSVGElement> | null | undefined) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref: ((instance: SVGSVGElement | null) => void) | RefObject<SVGSVGElement> | null | undefined) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref: ((instance: SVGSVGElement | null) => void) | RefObject<SVGSVGElement> | null | undefined) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref: ((instance: SVGSVGElement | null) => void) | RefObject<SVGSVGElement> | null | undefined) => <ChevronRight {...props} ref={ref} />),
  Edit: forwardRef((props, ref: ((instance: SVGSVGElement | null) => void) | RefObject<SVGSVGElement> | null | undefined) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref: ((instance: SVGSVGElement | null) => void) | RefObject<SVGSVGElement> | null | undefined) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref: ((instance: SVGSVGElement | null) => void) | RefObject<SVGSVGElement> | null | undefined) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref: ((instance: SVGSVGElement | null) => void) | RefObject<SVGSVGElement> | null | undefined) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref: ((instance: SVGSVGElement | null) => void) | RefObject<SVGSVGElement> | null | undefined) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref: ((instance: SVGSVGElement | null) => void) | RefObject<SVGSVGElement> | null | undefined) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref: ((instance: SVGSVGElement | null) => void) | RefObject<SVGSVGElement> | null | undefined) => <ChevronLeft {...props} ref={ref} />),
  ResetSearch: forwardRef((props, ref: ((instance: SVGSVGElement | null) => void) | RefObject<SVGSVGElement> | null | undefined) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref: ((instance: SVGSVGElement | null) => void) | RefObject<SVGSVGElement> | null | undefined) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref: ((instance: SVGSVGElement | null) => void) | RefObject<SVGSVGElement> | null | undefined) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref: ((instance: SVGSVGElement | null) => void) | RefObject<SVGSVGElement> | null | undefined) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref: ((instance: SVGSVGElement | null) => void) | RefObject<SVGSVGElement> | null | undefined) => <ViewColumn {...props} ref={ref} />)
};

export enum ReportQuarter {
  Previous = 1,
  Current = 2,
};

export const convertDateToYyyyMmDdString = (dateValue: Date) => {
  return new Date(dateValue.getTime() - (dateValue.getTimezoneOffset() * 60000 )).toISOString().split('T')[0];
};

export const getDefaultDateRange = (reportQuarter: ReportQuarter): ReportOptionsDateRangeDto => {
    /* set initial (quarterly) date range; last quarter or current quarter */
    const offset = (reportQuarter === ReportQuarter.Previous) ? -3 : 0;
    var seedDate = moment().add(offset, 'month').toDate();
    var quarter = Math.floor((seedDate.getMonth() / 3));
    var dateFrom = new Date(seedDate.getFullYear(), quarter * 3, 1);
    var dateThru = new Date(dateFrom.getFullYear(), dateFrom.getMonth() + 3, 0);
    return {dateFrom: convertDateToYyyyMmDdString(dateFrom), dateThru: convertDateToYyyyMmDdString(dateThru)} as ReportOptionsDateRangeDto;
}