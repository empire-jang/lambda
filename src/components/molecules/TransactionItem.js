import React from "react";
import styled from "styled-components";

import Container from "../atoms/Container";
import TransactionIcon from "../atoms/TransactionIcon";
import Text from "../atoms/Text";
import SubText from "../atoms/SubText";

import { useCoinValue } from "../../hooks/useCoinValue";

import { capitalise } from "../../utils/formatText";
import { getCurrentProfit } from "../../utils/transactionUtils";
import { parseBalance } from "../../utils/parseBalance";

const Wrapper = styled(Container)`
  :last-child {
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  }
`;

export const TransactionItem = ({ transaction, ...props }) => {
  const to =
    transaction.type === "referral"
      ? null
      : transaction.type === "investment"
      ? `/dashboard/investment/${transaction._id}`
      : `/dashboard/transactions/${transaction._id}`;

  const { amount } = useCoinValue(transaction.wallet, transaction.amount);

  return (
    <Wrapper
      p="16px"
      flex="space-between"
      wide="wide"
      border="1px solid"
      borderbottom="none"
      to={to}
      {...props}
    >
      <TransactionIcon type={transaction.type} />
      <Container
        w="calc(100% - 36px)"
        p="2px 0px 2px 12px"
        h="36px"
        flex="space-between"
      >
        <Container flexCol="flex-start" justify="space-between" o="hidden">
          <Text font="12px" p="0" bold>
            {transaction.type === "referral"
              ? "Referral Bonus"
              : transaction.description ||
                transaction.wallet.toUpperCase() +
                  " " +
                  capitalise(transaction.type)}
            {(transaction.type === "withdrawal" && transaction.status === "pending") ? " (Pending)" : ""}
          </Text>
          <Text font="10px" p="0" opacity="0.8">
            {new Date(transaction.date).toDateString()}
          </Text>
        </Container>
        <Container flexCol="flex-end" justify="center" w="auto">
          <Text font="12px" p="0">
            {amount + " " + transaction.wallet.toUpperCase()}
          </Text>
          <Text font="11px" p="0">
            {transaction.amount.toLocaleString()} USD{" "}
            {transaction.type === "investment" ? (
              <SubText p="0" font="inherit" bold color="success">
                +{parseBalance(getCurrentProfit(transaction))} USD
              </SubText>
            ) : undefined}
          </Text>
        </Container>
      </Container>
    </Wrapper>
  );
};

export const AdminTransactionItem = ({
  transaction,
  showUsername,
  ...props
}) => {
  const to =
    transaction.type === "referral"
      ? null
      : `/dashboard/admin/users/${transaction.user._id}/transactions/${transaction._id}`;

  const { amount } = useCoinValue(transaction.wallet, transaction.amount);

  return (
    <Wrapper
      p="16px"
      flex="space-between"
      wide="wide"
      border="1px solid"
      borderbottom="none"
      to={to}
      {...props}
    >
      <TransactionIcon type={transaction.type} />
      <Container
        w="calc(100% - 36px)"
        p="2px 0px 2px 12px"
        h="36px"
        flex="space-between"
      >
        <Container flexCol="flex-start" justify="space-between" o="hidden">
          <Text font="12px" p="0" bold>
            {showUsername
              ? transaction.user?.fullName
              : `${transaction.wallet.toUpperCase()} ${capitalise(
                  transaction.type
                )}`}
            {(transaction.type === "withdrawal" && transaction.status === "pending") ? " (Pending)" : ""}
          </Text>
          <Text font="10px" p="0" opacity="0.8">
            {new Date(transaction.date).toDateString()}
          </Text>
        </Container>
        <Container flexCol="flex-end" justify="center">
          <Text font="12px" p="0">
            {amount + " " + transaction.wallet.toUpperCase()}
          </Text>
          <Text font="11px" p="0">
            {transaction.amount.toLocaleString()} USD{" "}
            {transaction.type === "investment" ? (
              <SubText p="0" font="inherit" bold color="success">
                +{parseBalance(getCurrentProfit(transaction))} USD{" "}
                {transaction.profit > getCurrentProfit(transaction) && (
                  <>
                    <SubText p="0" font="inherit" bold color="text">
                      of
                    </SubText>{" "}
                    <SubText p="0" font="inherit" bold color="danger">
                      {transaction.profit} USD
                    </SubText>
                  </>
                )}
              </SubText>
            ) : undefined}
          </Text>
        </Container>
      </Container>
    </Wrapper>
  );
};
