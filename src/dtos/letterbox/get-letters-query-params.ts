export class GetLettersQueryParams {
  /**
   * The date to get letters from
   *
   * @property {string | Date} from-date
   * @memberof GetLettersQueryParams
   * @public
   * @optional
   */
  public 'from-date'?: string | Date;

  /**
   * The date to get letters to
   *
   * @property {string | Date} to-date
   * @memberof GetLettersQueryParams
   * @public
   * @optional
   */
  public 'to-date'?: string | Date;

  /**
   * The folder to get letters from
   *
   * @property {'INBOX_FOLDER' | 'SENT_FOLDER'} letter-folder
   * @memberof GetLettersQueryParams
   * @public
   * @default 'INBOX_FOLDER'
   * @optional
   */
  public 'letter-folder'?: 'INBOX_FOLDER' | 'SENT_FOLDER' = 'INBOX_FOLDER';

  /**
   * The type of letters to get
   *
   * @property {'CLASSIC_LETTER' | 'SMART_LETTER' | 'SMART_LETTER_ANSWER' | 'SIMPLE_SHORT_MESSAGE' | 'INCAMAIL'} letter-types
   * @memberof GetLettersQueryParams
   * @public
   * @default 'CLASSIC_LETTER'
   * @optional
   */
  public 'letter-types'?:
    | 'CLASSIC_LETTER'
    | 'SMART_LETTER'
    | 'SMART_LETTER_ANSWER'
    | 'SIMPLE_SHORT_MESSAGE'
    | 'INCAMAIL' = 'CLASSIC_LETTER';

  /**
   * The limit of letters to get
   *
   * @property {number} limit
   * @memberof GetLettersQueryParams
   * @public
   * @optional
   * @default 20
   */
  public limit?: number;

  /**
   * The offset of letters to get
   *
   * @property {number} offset
   * @memberof GetLettersQueryParams
   * @public
   * @optional
   * @default 0
   */
  public offset?: number;

  /**
   * The case id of the sender
   *
   * @property {'ASC' | 'DESC'} sort-order
   *  @memberof GetLettersQueryParams
   * @public
   * @optional
   */
  public senderCaseId?: string;

  /**
   * The end to end id of the sender
   *
   * @property {'ASC' | 'DESC'} sender-end-to-end-id
   * @memberof GetLettersQueryParams
   * @public
   * @optional
   */
  public senderEndToEndId?: string;

  /**
   * The id of the sender participant
   *
   * @property {string} sender-participant-id
   * @memberof GetLettersQueryParams
   * @public
   * @optional
   */
  public senderParticipantId?: string;

  /**
   * The id of the sender user
   *
   * @property {'ASC' | 'DESC'} sort-order
   * @memberof GetLettersQueryParams
   * @public
   * @optional
   */
  public senderUserId?: string;

  /**
   * Converts the object to query params
   *
   * Makes sure that from-date and to-date are set together or not at all set
   * and converts the dates to the correct format (YYYY-MM-DD)
   *
   * @method toQueryParams
   * @memberof GetLettersQueryParams
   * @instance
   * @public
   * @throws {Error} from-date and to-date must be set together
   * @returns {GetLettersQueryParams}
   */
  public static validateAndTransform(
    params: GetLettersQueryParams
  ): GetLettersQueryParams {
    if (
      (params['from-date'] && !params['to-date']) ||
      (!params['from-date'] && params['to-date'])
    ) {
      throw new Error('from-date and to-date must be set together');
    }

    if (params['from-date'] && params['to-date']) {
      if (typeof params['from-date'] !== 'string') {
        params['from-date'] = params['from-date']?.toISOString().split('T')[0];
      }

      if (typeof params['to-date'] !== 'string') {
        params['to-date'] = params['to-date']?.toISOString().split('T')[0];
      }
    }

    if (params.limit && params.limit > 100) {
      throw new Error('The limit can not be greater than 100.');
    }

    if (params.offset && params.offset < 0) {
      throw new Error('The offset can not be less than 0.');
    }

    return params;
  }
}
