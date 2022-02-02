# Sentry Application for Enonic XP

Enriches logging in XP with sentry.io

## Configuring logback

Configure your **XP_HOME/config/logback.xml** according to the [Sentry docs](https://docs.sentry.io/platforms/java/guides/logback/#configure) 
by adding the following `appender`.

```xml
<?xml version="1.0"?>
<configuration scan="true" scanPeriod="60 seconds">
  <appender name="Sentry" class="io.sentry.logback.SentryAppender">
    <options>
      <dsn>https://examplePublicKey@o0.ingest.sentry.io/0</dsn>
      <environment>dev</environment>
      <attachStacktrace>false</attachStacktrace>
      <tracesSampleRate>0.2</tracesSampleRate>
    </options>
  </appender>
  
  <root level="info">
    <appender-ref ref="STDOUT"/>
    <appender-ref ref="FILE"/>
    <appender-ref ref="Sentry"/>
  </root>
</configuration>
```
