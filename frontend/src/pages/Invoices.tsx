import { DownloadOutlined } from "@ant-design/icons";
import { Button, Col, Input, Row, Table, Tag } from "antd";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import { useEffect, useState } from "react";
import type { FilterValue, SorterResult } from "antd/es/table/interface";
import * as XLSX from "xlsx";

const { Search } = Input;

enum InvoiceStatus {
  Unpaid = "Unpaid",
  Pending = "Pending",
  Paid = "Paid",
}

const statusLabels: Record<InvoiceStatus, string> = {
  [InvoiceStatus.Unpaid]: "Ödenmedi",
  [InvoiceStatus.Pending]: "Bekliyor",
  [InvoiceStatus.Paid]: "Ödendi",
};

interface Invoice {
  key: React.Key;
  id: number; // Add id property
  service_name: string;
  invoice_number: number;
  date: string;
  amount: number;
  status: InvoiceStatus;
}

const columns: ColumnsType<Invoice> = [
  {
    title: "Servis Adı",
    dataIndex: "service_name",
    sorter: true,
    ellipsis: true,
    width: "33%",
  },
  {
    title: "Fatura Numarası",
    dataIndex: "invoice_number",
    sorter: true,
    align: "right",
    width: 160,
  },
  {
    title: "Tarih",
    dataIndex: "date",
    sorter: true,
    render: (date: string) =>
      new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      }),
    width: 180,
  },
  {
    title: "Tutar",
    dataIndex: "amount",
    sorter: true,
    render: (amount: number) =>
      `$${amount.toLocaleString("en", {
        useGrouping: true,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
    align: "right",
    width: 120,
  },
  {
    title: "Durum",
    dataIndex: "status",
    sorter: true,
    render: (status: InvoiceStatus) => {
      const color =
        status === InvoiceStatus.Unpaid
          ? "red"
          : status === InvoiceStatus.Pending
          ? "orange"
          : "green";
      return <Tag color={color}>{statusLabels[status]}</Tag>;
    },
    align: "center",
    width: 120,
  },
  {
    title: "",
    dataIndex: "",
    key: "action",
    render: () => (
      <Button block type="link">
        Göster
      </Button>
    ),
    align: "center",
    width: 180,
  },
];

export default function Invoices() {
  const [data, setData] = useState<Invoice[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [sorter, _] = useState<SorterResult<Invoice>>({});
  const [search, setSearch] = useState<string>("");

  const fetchData = (params: any = {}) => {
    setLoading(true);
    const { current, pageSize } = params.pagination;
    const { field, order } = params.sorter;

    const query = new URLSearchParams({
      page: current.toString(),
      pageSize: pageSize.toString(),
      sortField: field || "id",
      sortOrder: order === "ascend" ? "asc" : "desc",
      search: search,
    });

    fetch(`${import.meta.env.VITE_API_URL}/invoices?${query.toString()}`)
      .then((response) => response.json())
      .then((data) => {
        setData(data.invoices);
        setPagination({
          ...params.pagination,
          total: data.total,
        });
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching invoices:", error);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData({
      pagination,
      sorter,
    });
  }, [search]);

  const handleTableChange = (
    pagination: TablePaginationConfig,
    _filters: Record<string, FilterValue | null>,
    sorter: SorterResult<Invoice> | SorterResult<Invoice>[]
  ) => {
    fetchData({
      pagination,
      sorter: Array.isArray(sorter) ? sorter[0] : sorter,
    });
  };

  const onSearch = (value: string) => {
    setSearch(value);
  };

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    onSelect: (record: Invoice, selected: boolean) => {
      if (selected) {
        setSelectedRowKeys([...selectedRowKeys, record.id]);
      } else {
        setSelectedRowKeys(selectedRowKeys.filter((key) => key !== record.id));
      }
    },
    onSelectAll: (selected: boolean, selectedRows: Invoice[]) => {
      if (selected) {
        setSelectedRowKeys(selectedRows.map((row) => row.id));
      } else {
        setSelectedRowKeys([]);
      }
    },
  };

  const downloadExcel = () => {
    const selectedData = selectedRowKeys.length
      ? data.filter((item) => selectedRowKeys.includes(item.id))
      : data;

    const worksheet = XLSX.utils.json_to_sheet(selectedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Invoices");

    const now = new Date();
    const formattedDate = now.toISOString().slice(0, 19).replace(/[-:T]/g, "");
    const filename = `invoices-${formattedDate}.xlsx`;

    XLSX.writeFile(workbook, filename);
  };

  return (
    <>
      <Row>
        <Col span={8}>
          <Search
            placeholder="Fatura ara"
            onSearch={onSearch}
            style={{ flex: 1 }}
            loading={loading}
          />
        </Col>
        <Col span={8} offset={8} style={{ textAlign: "right" }}>
          <Button
            icon={<DownloadOutlined />}
            type="default"
            onClick={downloadExcel}
          />
        </Col>
      </Row>
      <Row style={{ marginTop: "2.5em" }}>
        <Col span={24}>
          <Table
            scroll={{ x: 768, y: 500 }}
            columns={columns}
            rowKey={(record) => record.id}
            dataSource={data}
            pagination={pagination}
            loading={loading}
            rowSelection={rowSelection}
            onChange={handleTableChange}
          />
        </Col>
      </Row>
    </>
  );
}
