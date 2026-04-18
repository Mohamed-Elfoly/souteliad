import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAllProgressReports } from "../api/reportApi";

const ITEMS_PER_PAGE = 8;

export function useReports() {
  const [search,      setSearch]      = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);

  const { data: reportsData, isLoading } = useQuery({
    queryKey: ["progress-reports"],
    queryFn:  () => getAllProgressReports({ limit: 100 }),
  });

  // Normalize raw API data
  const reports = (reportsData?.data?.data?.data || []).map((r) => ({
    ...r,
    studentName: `${r.studentId?.firstName || ""} ${r.studentId?.lastName || ""}`.trim(),
  }));

  // Filter by search term
  const filtered = reports.filter(
    (r) => !search || r.studentName.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated  = filtered.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  // Selection helpers
  const toggleSelect = (id) =>
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  const toggleSelectAll = () =>
    setSelectedIds(
      selectedIds.length === paginated.length ? [] : paginated.map((r) => r.id || r._id)
    );

  const handleSearchChange = (value) => {
    setSearch(value);
    setCurrentPage(1); // reset to first page on new search
  };

  return {
    // state
    search,
    currentPage,
    selectedIds,
    isLoading,
    // derived
    filtered,
    paginated,
    totalPages,
    // actions
    handleSearchChange,
    setCurrentPage,
    toggleSelect,
    toggleSelectAll,
    ITEMS_PER_PAGE,
  };
}