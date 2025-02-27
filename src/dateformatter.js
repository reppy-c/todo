import { format, isToday, isTomorrow, isYesterday } from "date-fns";

// Uses date-fns library to figure out dates and return a friendly string
// Need to figure out somme way to change formatting to red if its overdue
export default function formatDate(date) {
    if (isToday(date)) {
        return "Today";
    }
    
    else if(isTomorrow(date)) {
        return "Tomorrow";
    }

    else if(isYesterday(date)) {
        return "Yesterday";
    }

    else {
        return format(date, "MMMM do");
    }
}