FROM golang:1.18

ADD . /consumer

WORKDIR /consumer
RUN go mod init consumer
RUN go mod tidy
RUN go build -o consumer .
RUN chmod +x /consumer

ENTRYPOINT ["/consumer/consumer"]