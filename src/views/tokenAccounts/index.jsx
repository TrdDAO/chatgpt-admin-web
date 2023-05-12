import {
  getTokenAccounts,
} from '@/service/tokenAccount';
import CustomTable from '@/components/CustomTable';
import dayjs from 'dayjs';
import React, { useRef } from "react";
import './index.less';

const TokenAccount = (props) => {

  // 表格引用，用于触发里面的方法
  const tableRef = useRef(null);

  /**
   * 表头
   * 最好指定宽度，最多留一列自适应
   */
  const columns = [
    {
      title: "账户ID",
      dataIndex: "accountId",
      key: "accountId",
      width: 200,
      fixed: "left",
    },
    {
      title: "所属用户",
      dataIndex: "ownerUsername",
      key: "avataownerUsernamerUrl",
      width: 150,
    },
    {
      title: "模型",
      dataIndex: "model",
      key: "model",
      width: 100,
    },
    {
      title: "付费token",
      dataIndex: "totalTokens",
      key: "totalTokens",
      width: 150,
    },
    {
      title: "已支付token",
      dataIndex: "paidTokens",
      key: "paidTokens",
      ellipsis: true,
      width: 130,
    },
    {
      title: "最近使用时间",
      dataIndex: "latestTokenUsedTimeString",
      key: "latestTokenUsedTimeString",
      ellipsis: true,
      width: 150,
    },
    {
      title: "最近一次用量",
      dataIndex: "tokenUsage.latestUsage",
      key: "tokenUsage.latestUsage",
      ellipsis: true,
      width: 150,
    },
    {
      title: "今日用量",
      dataIndex: "tokenUsage.dayUsage",
      key: "tokenUsage.dayUsage",
      ellipsis: true,
      width: 150,
    },
    {
      title: "本月用量",
      dataIndex: "tokenUsage.monthUsage",
      key: "tokenUsage.monthUsage",
      ellipsis: true,
      width: 150,
    },
    {
      title: "总用量",
      dataIndex: "tokenUsage.totalUsage",
      key: "tokenUsage.totalUsage",
      ellipsis: true,
      width: 150,
    },
  ];

  return (
    <div className="app-container">
      {/* 通用表格，只需要传入 getDataApi 即可，其他逻辑内部处理 */}
      <CustomTable
        columns={columns}
        getDataApi={({current, size})=>{
          return getTokenAccounts({current, size}).then((res) => {
            res.content = res.content.map((item) => {
              for(let [key, value] of Object.entries(item.tokenUsage)) {
                item[`tokenUsage.${key}`] = value;
              }
              item.latestTokenUsedTimeString = item.latestTokenUsedTime ? dayjs(item.latestTokenUsedTime).format('YYYY-MM-DD HH:mm:ss') : '';
              item.key = item.accountId;
              console.log(item)
              return item
            })
            return Promise.resolve(res)
          })
        }}
        showPagination
        title={null}
        ref={tableRef}
      />
    </div>
  );
};

export default TokenAccount;
