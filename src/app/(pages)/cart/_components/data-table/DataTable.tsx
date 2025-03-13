'use client';

import * as React from 'react';
import {
  ColumnDef,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  useReactTable
} from '@tanstack/react-table';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { CartPriceList } from '../CartPriceList';
import useSelectedCartStore from '@/zustand/cart/cart.data';
import Image from 'next/image';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: any[];
  selectedItems: string[];
}
//   data: TData[];
// }

export function DataTable<TData, TValue>({
  columns,
  data,
  selectedItems
}: DataTableProps<TData, TValue>) {
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  //const { selectedItems, setSelectedItems } = useSelectedCartStore();

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      columnVisibility,
      rowSelection
    }
  });

  return (
    <div className="max-w-screen-xl mx-auto">
      <div className="rounded-md border py-16px mt-16 md:mt-16">
        <Table className="bg-normal">
          <TableHeader className="border-b-4 font-medium md:border-t-4 md:border-b-2 md:text-base md:text-label-alternative border-[#F2F2F2] fixed md:static left-0 right-0 top-0 bg-normal z-10 py-2 mt-16">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <div className="flex flex-col justify-center items-center h-[40vh]">
                    <Image
                      src="/image/StateSad.png"
                      width={113}
                      height={96}
                      priority
                      alt={`장바구니가 비었어요`}
                      style={{ width: 113, height: 96 }}
                    />
                    <p className="text-label-assistive text-lg mt-4 font-medium">
                      장바구니가 비었어요
                    </p>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <CartPriceList data={data} selectedItems={selectedItems} />
    </div>
  );
}
