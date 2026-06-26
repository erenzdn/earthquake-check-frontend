import { fetchEvaluation, submitContactMessage } from "./Api";

describe("fetchEvaluation payload normalization", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test("gecerli form payloadinda yearBuilt vardir ve bos lat/lon null gider", async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ safetyGrade: "B" })
    });

    await fetchEvaluation({
      yearBuilt: "2008",
      floorCount: "7",
      address: " Ataturk Mahallesi ",
      buildingType: "",
      latitude: "",
      longitude: ""
    });

    const [, requestOptions] = global.fetch.mock.calls[0];
    const parsedBody = JSON.parse(requestOptions.body);

    expect(parsedBody).toEqual({
      yearBuilt: 2008,
      floorCount: 7,
      address: "Ataturk Mahallesi",
      buildingType: null,
      latitude: null,
      longitude: null
    });
    expect(parsedBody.buildingAge).toBeUndefined();
  });
});

describe("submitContactMessage", () => {
  beforeEach(() => {
    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test("backend ContactRequest ile uyumlu payload gonderir", async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      status: 201,
      json: async () => ({ id: "1", fullName: "Test" })
    });

    await submitContactMessage({
      fullName: "Test Kullanici",
      email: "test@example.com",
      subject: "Konu",
      message: "Bu bir test mesajidir."
    });

    const [url, requestOptions] = global.fetch.mock.calls[0];
    expect(url).toContain("/api/contact/messages");
    expect(requestOptions.method).toBe("POST");
    expect(JSON.parse(requestOptions.body)).toEqual({
      fullName: "Test Kullanici",
      email: "test@example.com",
      subject: "Konu",
      message: "Bu bir test mesajidir."
    });
  });
});
