"use client";

import { OrderProps, orderState } from "@/atoms/atoms";
import usePersonalPrice from "@/hook/usePersonalPrice";
import { useEffect, useState } from "react";
import { useRecoilValueLoadable } from "recoil";

const getLocalNum = (value: string | number) => {
  return Number(value).toLocaleString();
};

const Receipt = () => {
  const [isClient, setIsClient] = useState(false);
  const [isDetailShow, setIsDetailShow] = useState(false);
  const { state, contents } = useRecoilValueLoadable(orderState);
  const personalPrice = usePersonalPrice();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;
  if (state === "loading") <div>Loading...</div>;
  if (state === "hasError") <div>Error loading state</div>;

  const { totalPrice } = contents as OrderProps;
  const charge = +process.env.NEXT_PUBLIC_CHARGE!;
  const totalCount = personalPrice.reduce((acc, cur) => {
    return acc + cur.length;
  }, 0);

  return (
    <article className="receipt">
      <h3>요금 영수증</h3>
      <dl>
        <dt>결제 예정 금액</dt>
        <dd>
          {getLocalNum(+totalPrice + totalCount * charge)}원
          <span className="sub">유류할증료 및 제세공과금 포함</span>
        </dd>
      </dl>

      <div className="price-detail-box">
        <button
          type="button"
          className={`show-btn ${isDetailShow ? "act" : ""}`}
          onClick={() => setIsDetailShow(!isDetailShow)}
        >
          {isDetailShow ? "요금 정보 닫기" : `요금 정보 상세보기`}
        </button>

        {isDetailShow && (
          <div className="price-detail">
            {personalPrice.map((item, idx) => {
              const count = item.length;
              if (!count) return null;
              const type = idx === 0 ? "성인" : idx === 1 ? "소아" : "유아";
              let YR = 0;
              let taxes = 0;

              item[0].taxes?.map((tax) => {
                if (tax.code === "YR") YR = +tax.amount;
                else taxes += +tax.amount;
                return null;
              });

              return (
                <div key={idx} className="price">
                  <h4>
                    <span>
                      {type} <strong>{count}</strong>명
                    </span>
                    <span>
                      {getLocalNum(+item[0].total * count + charge)}원
                    </span>
                  </h4>
                  <table className="price-adult">
                    <caption>{type} 요금 정보</caption>
                    <tbody>
                      <tr>
                        <td className="tit">항공요금</td>
                        <td className="count">{count}명</td>
                        <td className="price">
                          {getLocalNum(+item[0].base * count)}원
                        </td>
                      </tr>
                      <tr>
                        <td className="tit">유류할증료</td>
                        <td className="count">{count}명</td>
                        <td className="price">{getLocalNum(YR * count)}원</td>
                      </tr>
                      <tr>
                        <td className="tit">제세공과금</td>
                        <td className="count">{count}명</td>
                        <td className="price">
                          {getLocalNum(taxes * count)}원
                        </td>
                      </tr>
                      <tr>
                        <td className="tit">발권 수수료</td>
                        <td className="count">{count}명</td>
                        <td className="price">
                          {getLocalNum(charge * count)}원
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </article>
  );
};

export default Receipt;
