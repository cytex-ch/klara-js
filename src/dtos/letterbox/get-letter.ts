export class GetLetterResponseDto {
  public id!: string;
  public letterTitle!: string;
  public fileName!: string;
  public senderParticipantId!: string;
  public senderUserId!: string;
  public senderCaseId!: string;
  public senderEndToEndId!: string;
  public documentTypes!: Array<string>;
  public letterContentReference!: string;
  public letterType!: string;
  public receivedDateTime!: string;
  public documentMessage!: string;
}
