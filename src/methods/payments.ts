import { NetvisorApiClient } from '..';
import { NetvisorMethod, forceArray, parseXml, buildXml } from './_method';
import { SalesPaymentListItem, SalesPaymentListParameters } from '../interfaces/payments';

export class NetvisorPaymentMethod extends NetvisorMethod {
  constructor(client: NetvisorApiClient) {
    super(client);
  }

  /**
   * Get sales payment list
   * @example await salesPaymentList({ beginDate: '2023-06-22', limitLinkedPayments: 0 })
   * @returns {SalesPaymentListItem[]} If no sales payments were retrieved, empty array will be returned.
   */
  async salesPaymentList(params?: SalesPaymentListParameters): Promise<SalesPaymentListItem[]> {
    // Get the raw xml response from Netvisor
    const responseXml = await this._client.get('salespaymentlist.nv', params);
    // Parse the xml to js object
    const xmlObject: any = parseXml(responseXml);
    // Create the return array
    const salesPaymentsList: SalesPaymentListItem[] = [];
    // Add items to return array
    if (xmlObject.salespaymentlist.salespayment) {
      forceArray(xmlObject.salespaymentlist.salespayment).forEach((xmlSalesPayment) => {
        // Create template object with mandatory properties
        const salesPaymentListItem: SalesPaymentListItem = {
          netvisorKey: parseInt(xmlSalesPayment.netvisorkey),
          name: xmlSalesPayment.name,
          date: xmlSalesPayment.date,
          sum: parseFloat(xmlSalesPayment.sum.replace(',', '.')),
          referenceNumber: xmlSalesPayment.referencenumber,
          foreignCurrencyAmount: parseFloat(xmlSalesPayment.foreigncurrencyamount.replace(',', '.')),
          invoiceNumber: parseInt(xmlSalesPayment.invoicenumber),
          paymentAccountName: xmlSalesPayment.paymentaccountname,
          voucherID: parseInt(xmlSalesPayment.voucherid),
          lastModifiedTimestamp: xmlSalesPayment.lastmodifiedtimestamp,
          paymentAccountNumber: xmlSalesPayment.paymentaccountnumber,
          paymentSource: parseInt(xmlSalesPayment.paymentsource),
          bankStatus: xmlSalesPayment.bankstatus
        };
        // Add optional properties if they exist
        if (xmlSalesPayment.bankstatuserrordescription) {
          salesPaymentListItem.bankStatusErrorDescription = xmlSalesPayment.bankstatuserrordescription;
        }
        salesPaymentsList.push(salesPaymentListItem);
      });
    }
    return salesPaymentsList;
  }
}
