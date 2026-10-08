package com.medai.backend.dto;

public class HeartPredictionRequest {

    private Double age = 50.0;
    private Double sex = 1.0;
    private Double cp = 0.0;
    private Double trestbps = 120.0;
    private Double chol = 200.0;
    private Double fbs = 0.0;
    private Double restecg = 0.0;
    private Double thalach = 150.0;
    private Double exang = 0.0;
    private Double oldpeak = 0.0;
    private Double slope = 1.0;
    private Double ca = 0.0;
    private Double thal = 2.0;

    public HeartPredictionRequest() {
    }

    public Double getAge() { return age; }
    public void setAge(Double age) { this.age = age; }

    public Double getSex() { return sex; }
    public void setSex(Double sex) { this.sex = sex; }

    public Double getCp() { return cp; }
    public void setCp(Double cp) { this.cp = cp; }

    public Double getTrestbps() { return trestbps; }
    public void setTrestbps(Double trestbps) { this.trestbps = trestbps; }

    public Double getChol() { return chol; }
    public void setChol(Double chol) { this.chol = chol; }

    public Double getFbs() { return fbs; }
    public void setFbs(Double fbs) { this.fbs = fbs; }

    public Double getRestecg() { return restecg; }
    public void setRestecg(Double restecg) { this.restecg = restecg; }

    public Double getThalach() { return thalach; }
    public void setThalach(Double thalach) { this.thalach = thalach; }

    public Double getExang() { return exang; }
    public void setExang(Double exang) { this.exang = exang; }

    public Double getOldpeak() { return oldpeak; }
    public void setOldpeak(Double oldpeak) { this.oldpeak = oldpeak; }

    public Double getSlope() { return slope; }
    public void setSlope(Double slope) { this.slope = slope; }

    public Double getCa() { return ca; }
    public void setCa(Double ca) { this.ca = ca; }

    public Double getThal() { return thal; }
    public void setThal(Double thal) { this.thal = thal; }
}
