import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import AddressForm from "./AddressForm";
import { fetchEvaluation } from "../Api";

jest.mock("../Api", () => ({
  fetchEvaluation: jest.fn()
}));

jest.mock("./Map", () => () => <div data-testid="mock-map">Mock Map</div>);

jest.mock("framer-motion", () => {
  const toPlainProps = (props) => {
    const {
      whileHover,
      whileTap,
      variants,
      initial,
      animate,
      exit,
      transition,
      ...rest
    } = props;
    return rest;
  };

  return {
    motion: {
      div: ({ children, ...props }) => <div {...toPlainProps(props)}>{children}</div>,
      input: (props) => <input {...toPlainProps(props)} />,
      button: ({ children, ...props }) => <button {...toPlainProps(props)}>{children}</button>
    }
  };
});

describe("AddressForm validation and API errors", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("yearBuilt boşken submit request atmadan alan hatası gösterir", async () => {
    render(<AddressForm />);

    fireEvent.click(screen.getByRole("button", { name: "Devam Et" }));
    fireEvent.change(screen.getByLabelText("Kat Sayısı"), { target: { value: "5" } });
    fireEvent.click(screen.getByRole("button", { name: "Risk Analizi Yap" }));

    expect(fetchEvaluation).not.toHaveBeenCalled();
    expect(await screen.findByText("Yapım yılı zorunludur.")).toBeInTheDocument();
  });

  test("backend 400 details buildingAge geldiginde yearBuilt alanina baglanir", async () => {
    fetchEvaluation.mockRejectedValue({
      status: 400,
      details: {
        buildingAge: "zorunludur."
      }
    });

    render(<AddressForm />);

    fireEvent.click(screen.getByRole("button", { name: "Devam Et" }));
    fireEvent.change(screen.getByLabelText("Yapım Yılı"), { target: { value: "2000" } });
    fireEvent.change(screen.getByLabelText("Kat Sayısı"), { target: { value: "7" } });
    fireEvent.click(screen.getByRole("button", { name: "Risk Analizi Yap" }));

    expect(await screen.findByText("Yapım Yılı: zorunludur.")).toBeInTheDocument();
    expect(
      screen.getByText("Gonderilen bilgiler dogrulanamadi. Lutfen alanlari kontrol edin.")
    ).toBeInTheDocument();

    await waitFor(() => {
      expect(fetchEvaluation).toHaveBeenCalledTimes(1);
    });
  });
});
