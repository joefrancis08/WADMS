import React, { useRef, useState, useMemo } from "react";
import { Menu, X, Bell, Pen, LogOut, RefreshCw, ClipboardPenLine, CheckCheck } from "lucide-react";
import PATH from "../../../constants/path";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useOutsideClick from "../../../hooks/useOutsideClick";
import { logoutUser } from "../../../api-calls/users/userAPI";
import { useAuth } from "../../../contexts/AuthContext";
import { showErrorToast, showSuccessToast } from "../../../utils/toastNotification";
import useFetchNotifications from "../../../hooks/fetch-react-query/useFetchNotifications";
import usePageTitle from "../../../hooks/usePageTitle";
import formatAreaName from "../../../utils/formatAreaName";
import { formatClock, humanizeCalendarDay } from "../../../utils/notifData";
import { patchNotification } from "../../../api-calls/notification/notificationAPI";

const { DASHBOARD, CGS, REPORTS } = PATH.INTERNAL_ASSESSOR;
const PROFILE_PIC_PATH = import.meta.env.VITE_PROFILE_PIC_PATH;

const navItems = [
  { id: "home", label: "Home", link: DASHBOARD },
  { id: 'cgs', label: 'CGS', link: CGS },
  { id: "about-us", label: "About Us", link: REPORTS },
];

const IALayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  usePageTitle("Home");

  const { email, fullName, profilePicPath, role } = user;

  const {
    notificationsData,
    notifLoading,
    notifError,
    notifRefetch,
  } = useFetchNotifications(user.userId);

  const notificationsRaw = notificationsData?.notificationData ?? [];

  // (Optional) If your API might return duplicates, de-dupe by notifId.
  const notifications = useMemo(() => {
    const seen = new Set();
    const out = [];
    for (const n of notificationsRaw) {
      const id = n?.notifId ?? `${n?.notifType}-${n?.createdAt ?? ""}-${n?.area ?? ""}`;
      if (seen.has(id)) continue;
      seen.add(id);
      out.push(n);
    }
    return out;
  }, [notificationsRaw]);

  const notifRef = useRef();
  const profileOptionRef = useRef();

  const [isOpen, setIsOpen] = useState(false);
  const [showProfileOption, setShowProfileOption] = useState(false);
  const [showNotif, setShowNotif] = useState(false);

  useOutsideClick(profileOptionRef, () => setShowProfileOption(false));
  useOutsideClick(notifRef, () => setShowNotif(false));

  const handleBellClick = () => setShowNotif((v) => !v);
  const handleProfileClick = () => setShowProfileOption((v) => !v);

  const handleLogout = async () => {
    try {
      const res = await logoutUser();
      if (res.data.success) {
        logout();
        showSuccessToast("Logged out successfully!", "top-center");
        localStorage.removeItem("token");
      } else {
        showErrorToast("Logout failed. Try again.");
      }
    } catch (error) {
      showErrorToast("Something went wrong. Try again.");
      console.error(error);
    }
  };

  const handleMarkAsRead = async (notifId, userId) => {
    try {
      await patchNotification(notifId, userId);
      notifRefetch();
    } catch (error) {
      console.log("Error updating notification:", error);
      throw error;
    }
  };

  const unreadCount = notifications.filter((n) => Number(n?.isRead) === 0).length;

  return (
    <div className=" min-h-screen flex flex-col bg-white text-slate-800">
      {/* Navbar */}
      <nav className="sticky top-0 bg-white border-b border-slate-200 z-50">
        <div className="w-full px-4 sm:px-6">
          <div className="relative flex items-center justify-evenly h-16">
            {/* Left: Brand */}
            <div
              onClick={() => navigate(DASHBOARD)}
              className="flex items-center gap-x-4 text-xl font-bold text-slate-900 cursor-pointer"
            >
              <img className="h-10 w-10" src="/pit-logo-outlined.png" alt="PIT Logo" />
              <p>Palompon Institute of Technology</p>
            </div>

            {/* Middle: Links (Desktop) */}
            <div className="hidden md:flex justify-center space-x-2 mx-auto">
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.link}
                  className={`py-2 px-4 rounded-md transition ${
                    location.pathname === item.link
                      ? "bg-slate-900 text-white font-semibold"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-x-3">
              <button
                title={`${unreadCount} unread notifications`}
                onClick={handleBellClick}
                className="relative p-2 rounded-full hover:bg-slate-100 cursor-pointer"
              >
                <Bell className="h-6 w-6 text-slate-700" />
                {unreadCount > 0 && (
                  <span className="absolute top-0 -right-1 bg-red-600 text-white px-2 rounded-full text-xs">
                    {unreadCount}
                  </span>
                )}
              </button>
              <button
                onClick={handleProfileClick}
                title={"My Profile"}
                className="flex items-center space-x-2 p-2 rounded-full hover:bg-slate-100 cursor-pointer"
              >
                <img
                  src={
                    profilePicPath?.startsWith("http")
                      ? profilePicPath
                      : `${PROFILE_PIC_PATH}/${user.profilePicPath || "default-profile-picture.png"}`
                  }
                  alt="Profile"
                  className="h-8 w-8 rounded-full object-cover"
                />
              </button>
              {/* Mobile Menu Toggle */}
              <button
                className="md:hidden p-2 rounded-md hover:bg-slate-100"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? <X className="h-6 w-6 text-slate-700" /> : <Menu className="h-6 w-6 text-slate-700" />}
              </button>
            </div>
          </div>
        </div>

        {/* Profile Options */}
        {showProfileOption && (
          <div
            ref={profileOptionRef}
            className="absolute top-[3.5rem] right-[1rem] rounded-lg shadow-lg z-50"
          >
            <div className="w-[24rem] min-h-[20rem] bg-white p-3 rounded-lg border border-slate-200">
              <div className="relative flex flex-col gap-y-4 justify-center items-center bg-slate-50 border border-slate-200 min-w-[5rem] min-h-[12rem] rounded-lg">
                <img
                  src={
                    profilePicPath?.startsWith("http")
                      ? profilePicPath
                      : `${PROFILE_PIC_PATH}/${user.profilePicPath || "default-profile-picture.png"}`
                  }
                  alt="Profile"
                  className="h-20 w-20 rounded-full object-cover"
                />
                <div className="flex flex-col items-center justify-center">
                  <p className="text-slate-900 text-xl font-bold">{user.fullName}</p>
                  <p className="text-slate-600 text-sm">{user.role}</p>
                  <p className="text-slate-500 text-xs font-light pt-2">{user.email}</p>
                </div>
                <button
                  title="Update info"
                  className="absolute top-1 right-1 text-slate-700 p-2 hover:bg-white rounded-full cursor-pointer active:opacity-80 active:scale-95 transition"
                >
                  <Pen className="h-5 w-5" />
                </button>
              </div>
              <hr className="border-slate-200 my-5" />
              <div className="p-4 bg-slate-50 hover:bg-slate-100 rounded-lg active:opacity-80 active:scale-95 cursor-pointer transition flex justify-center">
                <button onClick={handleLogout} className="flex gap-x-2 items-center justify-center text-slate-800">
                  <LogOut />
                  Log Out
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Notifications */}
        {showNotif && (
          <div
            ref={notifRef}
            className="absolute top-[3.5rem] right-[4rem] rounded-xl shadow-2xl z-[999]"
            aria-live="polite"
          >
            <div className="flex flex-col w-[32rem] max-h-[32rem] overflow-auto min-h-[30rem] bg-white p-0 rounded-xl border border-slate-200">
              {/* header */}
              <div className="sticky top-0 z-10 px-4 py-3 bg-white/95 backdrop-blur border-b border-slate-200 rounded-t-xl flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h2 className="text-slate-900 font-semibold text-xl">Notifications</h2>
                  <span className="text-xs text-slate-500">{notifications.length} total</span>
                  <span className="text-xs text-slate-500">• {unreadCount} unread</span>
                </div>
                <div className="flex items-center gap-2">
                  {notifLoading && <span className="text-xs text-slate-500 animate-pulse">Loading…</span>}
                  <button
                    onClick={notifRefetch}
                    className="text-xs px-3 py-1 rounded-full cursor-pointer bg-slate-900 hover:bg-black text-white active:opacity-90 active:scale-95 transition"
                    title="Refresh notifications"
                  >
                    <span className="flex gap-x-1 items-center">
                      <RefreshCw size={16} /> Refresh
                    </span>
                  </button>
                </div>
              </div>

              {/* error */}
              {notifError && (
                <div className="m-4 px-3 py-3 rounded-lg bg-red-50 text-red-700 border border-red-200">
                  <p className="text-sm">We couldn’t load notifications. Please try again.</p>
                  <button
                    onClick={notifRefetch}
                    className="mt-2 text-xs px-2 py-1 rounded bg-red-600 text-white hover:bg-red-700 transition"
                  >
                    Try again
                  </button>
                </div>
              )}

              {/* loading skeletons */}
              {notifLoading && !notifError && (
                <ul role="list" className="p-4 space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <li key={i} className="border border-slate-200 rounded-lg p-3 animate-pulse">
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded-full bg-slate-200" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 w-1/3 bg-slate-200 rounded" />
                          <div className="h-3 w-1/2 bg-slate-100 rounded" />
                          <div className="h-3 w-2/3 bg-slate-100 rounded" />
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              {/* empty */}
              {!notifLoading && !notifError && notifications.length === 0 && (
                <div className="flex flex-col items-center justify-center flex-1 text-center py-12 text-slate-500">
                  <div className="bg-slate-100 p-4 rounded-full mb-4">
                    <Bell className="h-8 w-8 text-slate-600" />
                  </div>
                  <p className="font-medium text-slate-700">You’re all caught up</p>
                  <p className="text-sm text-slate-500 mt-1">We’ll let you know when there’s something new.</p>
                </div>
              )}

              {/* list */}
              {!notifLoading && !notifError && notifications.length > 0 && (() => {
                const toDate = (n) => new Date(n?.notifDate || n?.createdAt || Date.now());
                const sorted = [...notifications].sort((a, b) => {
                  if (Number(a.isRead) !== Number(b.isRead)) return Number(a.isRead) - Number(b.isRead); // unread first
                  return toDate(b) - toDate(a); // newest first
                });

                const groups = sorted.reduce((acc, item) => {
                  const d = toDate(item);
                  const label = humanizeCalendarDay(d);
                  (acc[label] ||= []).push({ item, d });
                  return acc;
                }, {});

                const typeText = (t) =>
                  (t === "assignment" && "Assignment") ||
                  (t === "unassign" && "Unassigned") ||
                  (t === "reminder" && "Reminder") ||
                  (t === "deadline" && "Deadline") ||
                  "Update";

                const typeChipClass = (t) =>
                  t === "unassign"
                    ? "bg-red-100 text-red-800 border border-red-200"
                    : t === "deadline"
                    ? "bg-orange-100 text-orange-800 border border-orange-200"
                    : t === "reminder"
                    ? "bg-blue-100 text-blue-800 border border-blue-200"
                    : "bg-emerald-100 text-emerald-800 border border-emerald-200";

                return (
                  <div className="p-4 space-y-6">
                    {Object.entries(groups).map(([label, entries]) => (
                      <section key={label}>
                        <h4 className="px-1 text-xs font-semibold tracking-wide text-slate-500 uppercase">{label}</h4>
                        <ul role="list" className="mt-2 space-y-2">
                          {entries.map(({ item, d }, index) => {
                            const isUnread = Number(item?.isRead) === 0;
                            const timeStr = formatClock(d);

                            return (
                              <li
                                key={`${label}-${index}`}
                                className={`group border border-slate-200 rounded-lg px-3 py-2.5 transition hover:border-slate-300 hover:bg-slate-50 ${
                                  isUnread ? "bg-slate-50" : "bg-white"
                                }`}
                              >
                                <div className="flex items-start gap-3">
                                  <div className="relative bg-slate-100 p-2 rounded-full shrink-0 border border-slate-200">
                                    <ClipboardPenLine size={20} className="text-slate-700" />
                                    {isUnread && (
                                      <span
                                        className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-red-600"
                                        aria-label="Unread"
                                      />
                                    )}
                                  </div>

                                  <div className="flex-1 min-w-0">
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                      <span
                                        className={`inline-flex items-center text-[12px] uppercase tracking-wide rounded-full px-3 py-0.5 font-semibold ${typeChipClass(
                                          item?.notifType
                                        )}`}
                                      >
                                        {typeText(item?.notifType)}
                                      </span>
                                      {item.isRead === 0 && (
                                        <button
                                          onClick={() => handleMarkAsRead(item.notifId, user.userId)}
                                          className="flex items-center gap-x-1 text-slate-700 text-[10px] cursor-pointer rounded-full hover:bg-slate-100 px-2 py-0.5 active:scale-99"
                                        >
                                          <CheckCheck size={16} />
                                          Mark as read
                                        </button>
                                      )}
                                    </div>

                                    <hr className="border-slate-200 my-2" />

                                    <div className="flex flex-wrap items-center gap-2 mt-1">
                                      {(item?.accredTitle || item?.accredYear) && (
                                        <span className="inline-flex items-center text-[10px] rounded-full bg-yellow-100 border border-yellow-200 px-2 py-0.5 text-yellow-900">
                                          {(item?.accredTitle ?? "").trim()}
                                          {item?.accredTitle && item?.accredYear && " "}
                                          {item?.accredYear ?? ""}
                                        </span>
                                      )}
                                      {(item?.program || item?.level) && (
                                        <span className="inline-flex items-center text-[10px] rounded-full bg-slate-100 border border-slate-200 px-2 py-0.5 text-slate-700">
                                          {(item?.program ?? "").trim()}
                                          {item?.program && item?.level ? " – " : ""}
                                          {item?.level ?? ""}
                                        </span>
                                      )}
                                    </div>

                                    <p className={`text-[13px] mt-1.5 leading-snug ${isUnread ? "text-slate-900" : "text-slate-700"}`}>
                                      <span className="text-slate-600">
                                        {item?.notifType === "unassign" ? "You are unassigned from" : "You are assigned to"}
                                      </span>{" "}
                                      <span className="font-semibold">{formatAreaName(item?.area)}</span>
                                      {item?.parameter ? ` · Parameter ${item.parameter}` : ""}
                                      {item?.subparameter ? ` · ${item.subparameter}` : ""}.
                                    </p>

                                    <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                                      <time
                                        dateTime={(item?.notifDate || item?.createdAt) ?? ""}
                                        title={d.toLocaleString()}
                                      >
                                        {timeStr}
                                      </time>
                                      {item?.fullName && (
                                        <>
                                          <span>•</span>
                                          <span title="Notified user">{item.fullName}</span>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                      </section>
                    ))}
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden bg-white border-t border-slate-200 shadow-sm">
            <div className="space-y-1 px-4 py-3">
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.link}
                  className={`block px-3 py-2 rounded-md transition ${
                    location.pathname === item.link
                      ? "bg-slate-900 text-white font-semibold"
                      : "text-slate-700 hover:bg-slate-100"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-1 bg-white">{children}</main>
    </div>
  );
};

export default IALayout;
