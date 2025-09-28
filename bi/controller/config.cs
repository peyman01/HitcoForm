using System.Collections.Generic;
using System.Globalization;
using System;
using System.EnterpriseServices;

public class config
{
    private int refreshDays;
    private string delimiter;
    private string[] value;
    public config(string delimiter = "/", int refreshDays = 10)
    {
        this.refreshDays = refreshDays;
        this.delimiter = delimiter;
    }
    
    public string[] GetValue(string mode = "shamsi", string startDate = null)
    {
        if (mode == "shamsi")
        {
            value = GetPastDates(refreshDays, delimiter, startDate).ToArray();
        }
        if (mode == "miladi")
        {
            // Convert Shamsi startDate to Miladi before calling GetPastDatesMiladi
            if (!string.IsNullOrEmpty(startDate))
            {
                startDate = ConvertShamsiToMiladi(startDate); // Convert Shamsi to Miladi
            }
            value = GetPastDatesMiladi(refreshDays, delimiter, startDate).ToArray();
        }
        return value;
    }

    public string[] GetValueMiladi(string startDate = null)
    {
        return GetPastDatesMiladi(refreshDays, delimiter, startDate).ToArray();
    }

    public int daysToGoBack()
    {
        return refreshDays;
    }

    // Updated method to accept a start date
    public static List<string> GetPastDates(int numberOfDays, string delimiter, string startDate = null)
    {
        List<string> dates = new List<string>();
        PersianCalendar persianCalendar = new PersianCalendar();
        DateTime startDateTime;
        int offset = 1;

        // Parse the custom start date if provided
        if (!string.IsNullOrEmpty(startDate))
        {
            try
            {
                int year = int.Parse(startDate.Substring(0, 4));
                int month = int.Parse(startDate.Substring(4, 2));
                int day = int.Parse(startDate.Substring(6, 2));

                startDateTime = persianCalendar.ToDateTime(year, month, day, 0, 0, 0, 0);
                offset = 0;
            }
            catch
            {
                throw new Exception("Invalid start date format. Use YYYYMMDD.");
            }
        }
        else
        {
            startDateTime = DateTime.Today;
        }

        for (int i = offset; i < numberOfDays; i++)
        {
            DateTime pastDate = startDateTime.AddDays(-i);
            string formattedDate = $"{persianCalendar.GetYear(pastDate)}{delimiter}{persianCalendar.GetMonth(pastDate):D2}{delimiter}{persianCalendar.GetDayOfMonth(pastDate):D2}";
            dates.Add(formattedDate);
        }

        return dates;
    }

    // Miladi (Gregorian) version
    public static List<string> GetPastDatesMiladi(int numberOfDays, string delimiter, string startDate = null)
    {
        List<string> dates = new List<string>();
        DateTime startDateTime;
        int offset = 1;
        if (!string.IsNullOrEmpty(startDate))
        {
            try
            {
                startDateTime = DateTime.ParseExact(startDate, "yyyyMMdd", CultureInfo.InvariantCulture);
                offset = 0;

            }
            catch
            {
                throw new Exception("Invalid start date format. Use YYYYMMDD.");
            }
        }
        else
        {
            startDateTime = DateTime.Today;
        }

        for (int i = offset; i < numberOfDays; i++)
        {
            DateTime pastDate = startDateTime.AddDays(-i);
            string formattedDate = $"{pastDate.Year}{delimiter}{pastDate.Month:D2}{delimiter}{pastDate.Day:D2}";
            dates.Add(formattedDate);
        }

        return dates;
    }

    private string ConvertShamsiToMiladi(string shamsiDate)
    {
        try
        {
            PersianCalendar persianCalendar = new PersianCalendar();
            int year = int.Parse(shamsiDate.Substring(0, 4));
            int month = int.Parse(shamsiDate.Substring(4, 2));
            int day = int.Parse(shamsiDate.Substring(6, 2));

            DateTime miladiDate = persianCalendar.ToDateTime(year, month, day, 0, 0, 0, 0);
            return miladiDate.ToString("yyyyMMdd"); // Return Miladi date in YYYYMMDD format
        }
        catch
        {
            throw new Exception("Invalid Shamsi start date format. Use YYYYMMDD.");
        }
    }
}
