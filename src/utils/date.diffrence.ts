export class dateDiffrenceInHour {
  public static calculateTimeDifference(
    startDate: Date,
    endDate: Date
  ): number {
    const timeDiff = endDate.getTime() - startDate.getTime();
    const hoursDiff = timeDiff / (1000 * 60 * 60); // Convert milliseconds to hours
    return hoursDiff;
  }
}
