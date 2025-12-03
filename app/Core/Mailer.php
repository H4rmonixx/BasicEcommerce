<?php

namespace App\Core;

require_once __DIR__ . '/../Frameworks/PHPMailer/src/Exception.php';
require_once __DIR__ . '/../Frameworks/PHPMailer/src/PHPMailer.php';
require_once __DIR__ . '/../Frameworks/PHPMailer/src/SMTP.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

class Mailer
{
    private static array $config = [];
    private static PHPMailer $mail;

    protected static function init(): bool
    {
        if (empty(self::$config)) {
            $tmp = require __DIR__ . "/config.php";
            self::$config = $tmp['phpmailer'];
            self::$mail = new PHPMailer(true);
            try {
                self::$mail->isSMTP();
                self::$mail->Host       = self::$config['smtp_host'];
                self::$mail->SMTPSecure = self::$config['smtp_secure'];
                self::$mail->Port       = self::$config['smtp_port'];
                self::$mail->SMTPAuth   = true;
                self::$mail->CharSet = "UTF-8";
                self::$mail->Username   = self::$config['smtp_username'];
                self::$mail->Password   = self::$config['smtp_password'];
                self::$mail->setFrom(
                    self::$config['mail_from'],
                    self::$config['mail_from_name']
                );
                self::$mail->isHTML(true);

                return true;
            } catch (Exception $e) {
                error_log("Mailer init error: " . $e->getMessage());
                return false;
            }
        }
        return true;
    }

    public static function sendMail(string $email, string $subject, string $templateName, array $keys): bool
    {
        if(!self::init()) return false;

        try {
            self::$mail->addAddress($email);
            self::$mail->Subject = $subject;
            self::$mail->Body    = self::buildBody($templateName, $keys);

            return self::$mail->send();
        } catch (Exception $e) {
            error_log("General info email error: " . $e->getMessage());
            return false;
        }
    }

    protected static function buildBody($template, $keys): string{
        $body = file_get_contents(__DIR__ . '/../MailTemplates/' . $template);
        foreach($keys as $key => $value){
            $body = str_replace("@{".$key."}", $value, $body);
        }
        $body = preg_replace('/\{\{([^"]+)\}\}/', "", $body);

        return $body;
    }
}
