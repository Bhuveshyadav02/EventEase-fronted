import React, { useEffect, useState } from "react";
import {
  MdChevronLeft,
  MdChevronRight,
  MdLocationPin,
  MdToday,
  MdSchedule,
  MdGroup,
  MdDateRange,
} from "react-icons/md";
import { useNavigate } from "react-router-dom";
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isEqual,
  isSameDay,
  isSameMonth,
  isToday,
  parse,
  parseISO,
  startOfToday,
  isWithinInterval,
} from "date-fns";
import axios from "axios";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export const CalendarView = () => {
  let today = startOfToday();
  let [selectedDay, setSelectedDay] = useState(today);
  let [currentMonth, setCurrentMonth] = useState(format(today, "MMM-yyyy"));
  let firstDayCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date());

  const [hallNames, setHallNames] = useState([]); // State to store hall names
  const [selectedHalls, setSelectedHalls] = useState([]); // State for selected hall
  const [events, setEvents] = useState([]); // State for the events fetched from the API

  // Fetch events data from the API when the component mounts
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/events`, {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });
        console.log('Fetched events:', response.data.bookings);
        setEvents(response.data.bookings);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  // Fetch hall names from the API
  useEffect(() => {
    const fetchHallNames = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/gethalls`);
        console.log("Type of halls", response.data.halls);
        setHallNames(response.data.halls); // Assuming halls are retrieved as an array of objects with 'name' property
      } catch (error) {
        console.error("Error fetching hall names:", error);
      }
    };

    fetchHallNames();
  }, []);

  // Function to handle hall selection
  const handleHallSelection = (hallName) => {
    if (selectedHalls.includes(hallName)) {
      // Deselect hall if already selected
      setSelectedHalls(selectedHalls.filter((hall) => hall !== hallName));
    } else {
      // Select hall if not selected
      setSelectedHalls([...selectedHalls, hallName]);
    }
  };

  const isHallSelected = (hallName) => {
    return selectedHalls.includes(hallName);
  };

  const filteredEvents = selectedHalls.length > 0
    ? events.filter((event) => selectedHalls.includes(event.bookedHallName))
    : events;

  let days = eachDayOfInterval({
    start: firstDayCurrentMonth,
    end: endOfMonth(firstDayCurrentMonth),
  });

  function previousMonth() {
    let firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
  }

  function nextMonth() {
    let firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
  }

  let selectedDayMeetings = Array.isArray(filteredEvents)
    ? filteredEvents.filter((booking) => {
        const eventStartDate = booking.eventStartDate ? parseISO(booking.eventStartDate) : null;
        const eventEndDate = booking.eventEndDate ? parseISO(booking.eventEndDate) : null;
        const eventDate = booking.eventDate ? parseISO(booking.eventDate) : null;
        const eventDateType = booking.eventDateType;

        if (eventDateType === "full" || eventDateType === "half") {
          return eventDate && isSameDay(eventDate, selectedDay);
        } else if (eventDateType === "multiple") {
          return (
            eventStartDate &&
            eventEndDate &&
            (isWithinInterval(selectedDay, {
              start: eventStartDate,
              end: eventEndDate,
            }) || isSameDay(eventStartDate, selectedDay))
          );
        }

        return null;
      })
    : [];

  return (
    <div className="my-12">
      <div className="w-auto flex mb-10 items-center justify-center">
        <div className="flex items-center m-6">
          <div className="w-2 h-2 mr-2 bg-blue-600 rounded-full"></div>
          <p className="text-sm text-gray-700">Full Day Event</p>
        </div>
        <div className="flex items-center m-6">
          <div className="w-2 h-2 mr-2 bg-green-600 rounded-full"></div>
          <p className="text-sm text-gray-700">Half Day Event</p>
        </div>
        <div className="flex items-center m-6">
          <div className="w-2 h-2 mr-2 bg-red-600 rounded-full"></div>
          <p className="text-sm text-gray-700">Multiple Day Event</p>
        </div>
      </div>

      <div className="max-w-md px-4 mx-auto sm:px-7 md:max-w-7xl md:px-6">
        <div className="md:grid md:grid-cols-5 md:divide-x md:divide-gray-300">
          <div className="">
            <div className="flex flex-col items-center">
              <h1 className="text-xl sm:text-3xl mb-4 md:text-4xl lg:text-3xl xl:text-3xl text-center text-gray-800 font-black leading-7 ml-3 md:leading-10">
                Filters
              </h1>
              <h2 className="text-xl font-bold mb-4 text-indigo-700 -mt-1">
                By Hall Name
              </h2>
              <button
                className={`py-2 px-8 rounded-full mb-4 mx-4 focus:outline-none ${selectedHalls.length === 0 ? "bg-indigo-100 text-indigo-800" : "bg-white text-gray-800 hover:bg-gray-100"}`}
                onClick={() => setSelectedHalls([])}
              >
                All
              </button>
              {hallNames.map((hall) => (
                <button
                  key={hall.id}
                  className={`py-2 px-8 rounded-full mb-4 mx-4 focus:outline-none ${isHallSelected(hall.name) ? "bg-indigo-100 text-indigo-800" : "bg-white text-gray-800 hover:bg-gray-100"}`}
                  onClick={() => handleHallSelection(hall.name)}
                >
                  {hall.name}
                </button>
              ))}
            </div>
          </div>

          <div className="md:px-7 col-span-2">
            <div className="flex items-center">
              <h2 className="flex-auto font-semibold text-gray-900">
                {format(firstDayCurrentMonth, "MMMM yyyy")}
              </h2>
              <button
                type="button"
                onClick={previousMonth}
                className="-my-1.5 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Previous month</span>
                <MdChevronLeft className="w-7 h-7" aria-hidden="true" />
              </button>
              <button
                onClick={nextMonth}
                type="button"
                className="-my-1.5 -mr-1.5 ml-2 flex flex-none items-center justify-center p-1.5 text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Next month</span>
                <MdChevronRight className="w-7 h-7" aria-hidden="true" />
              </button>
            </div>
            <div className="grid grid-cols-7 mt-10 mb-10 text-base font-semibold leading-6 text-center text-gray-800">
              <div>Su</div>
              <div>Mo</div>
              <div>Tu</div>
              <div>We</div>
              <div>Th</div>
              <div>Fr</div>
              <div>Sa</div>
            </div>
            <div className="grid grid-cols-7 mt-2 text-sm">
              {days.map((day, dayIdx) => (
                <div
                  key={day.toString()}
                  className={classNames(
                    dayIdx === 0 && colStartClasses[getDay(day)],
                    "py-1.5"
                  )}
                >
                  <button
                    type="button"
                    onClick={() => setSelectedDay(day)}
                    className={classNames(
                      isEqual(day, selectedDay) && "text-white",
                      !isEqual(day, selectedDay) &&
                        isToday(day) &&
                        "text-red-500",
                      !isEqual(day, selectedDay) &&
                        !isToday(day) &&
                        isSameMonth(day, firstDayCurrentMonth) &&
                        "text-gray-900",
                      !isEqual(day, selectedDay) &&
                        !isToday(day) &&
                        !isSameMonth(day, firstDayCurrentMonth) &&
                        "text-gray-400",
                      isEqual(day, selectedDay) && isToday(day) && "bg-red-500",
                      isEqual(day, selectedDay) &&
                        !isToday(day) &&
                        "bg-gray-900",
                      !isEqual(day, selectedDay) && "hover:bg-gray-200",
                      (isEqual(day, selectedDay) || isToday(day)) &&
                        "font-semibold",
                      "mx-auto flex h-8 w-8 items-center justify-center rounded-full"
                    )}
                  >
                    <time dateTime={format(day, "yyyy-MM-dd")}>
                      {format(day, "d")}
                    </time>
                  </button>

                  <div className="h-1 w-auto mx-auto mt-1">
                    <div className="flex mx-auto items-center">
                      {Array.isArray(filteredEvents) &&
                        filteredEvents.map((booking) => {
                          const eventStartDate = booking.eventStartDate ? parseISO(booking.eventStartDate) : null;
                          const eventEndDate = booking.eventEndDate ? parseISO(booking.eventEndDate) : null;
                          const eventDate = booking.eventDate ? parseISO(booking.eventDate) : null;
                          const eventDateType = booking.eventDateType;

                          if (eventDateType === "full" && eventDate && isSameDay(eventDate, day)) {
                            return (
                              <div
                                key={booking.id}
                                className="w-2 mx-auto flex items-center h-2 mt-.5 rounded-full bg-blue-600"
                              ></div>
                            );
                          } else if (eventDateType === "half" && eventDate && isSameDay(eventDate, day)) {
                            return (
                              <div
                                key={booking.id}
                                className="w-2 mx-auto flex items-center h-2 mt-.5 rounded-full bg-green-600"
                              ></div>
                            );
                          } else if (
                            eventDateType === "multiple" &&
                            eventStartDate &&
                            eventEndDate &&
                            (isWithinInterval(day, {
                              start: eventStartDate,
                              end: eventEndDate,
                            }) || isSameDay(eventStartDate, day))
                          ) {
                            return (
                              <div
                                key={booking.id}
                                className="w-2 mx-auto flex items-center h-2 mt-.5 rounded-full bg-red-600"
                              ></div>
                            );
                          }

                          return null;
                        })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <section className="mt-12 md:mt-0 md:pl-14 md:col-span-2">
            <h2 className="font-semibold text-gray-900">
              Schedule for{" "}
              <time dateTime={format(selectedDay, "yyyy-MM-dd")}>
                {format(selectedDay, "MMM dd, yyyy")}
              </time>
            </h2>
            <ol className="mt-4 space-y-1 text-sm leading-6 text-gray-500">
              {selectedDayMeetings.length > 0 ? (
                selectedDayMeetings.map((meeting) => (
                  <Meeting meeting={meeting} key={meeting.id} />
                ))
              ) : (
                <p>No events for today.</p>
              )}
            </ol>
          </section>
        </div>
      </div>
    </div>
  );
};

function Meeting({ meeting }) {
    console.log({meeting})
  let startDateTime = parseISO(meeting.eventDate);
  let endDateTime = parseISO(meeting.eventEndDate);

  return (
    <li className="flex items-center space-x-4">
      <img
        src={meeting.imageUrl}
        alt=""
        className="flex-none w-10 h-10 rounded-full"
      />
      <div className="flex-auto">
        <h3 className="font-semibold text-gray-900">{meeting.bookedHallName}</h3>
        <dl className="mt-0.5 flex flex-col text-gray-500">
          <div>
            <dt className="sr-only">Date</dt>
            <dd>
              {format(startDateTime, "h:mm a")} - {format(endDateTime, "h:mm a")}
            </dd>
          </div>
          <div className="mt-1 flex items-center">
            <dt className="sr-only">Location</dt>
            <dd>
              <MdLocationPin
                size="1.5em"
                className="mr-1 text-gray-400"
                aria-hidden="true"
              />
              {meeting.location}
            </dd>
          </div>
        </dl>
      </div>
    </li>
  );
}

const colStartClasses = [
  "",
  "col-start-2",
  "col-start-3",
  "col-start-4",
  "col-start-5",
  "col-start-6",
  "col-start-7",
];
