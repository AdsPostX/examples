# Add project specific ProGuard rules here.
# You can control the set of applied configuration files using the
# proguardFiles setting in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Preserve the line number information for debugging stack traces
-keepattributes SourceFile,LineNumberTable

# Hide the original source file name
-renamesourcefileattribute SourceFile

# ====================================================================================
# Kotlinx Serialization - Official Rules
# Source: https://github.com/Kotlin/kotlinx.serialization/blob/master/rules/common.pro
# ====================================================================================

# Keep `Companion` object fields of serializable classes.
# This avoids serializer lookup through `getDeclaredClasses` as done for named companion objects.
-if @kotlinx.serialization.Serializable class **
-keepclassmembers class <1> {
    static <1>$* Companion;
}

# Keep names for named companion object from obfuscation
# Names of a class and of a field are important in lookup of named companion in runtime
-keepnames @kotlinx.serialization.internal.NamedCompanion class *
-if @kotlinx.serialization.internal.NamedCompanion class *
-keepclassmembernames class * {
    static <1> *;
}

# Keep `serializer()` on companion objects (both default and named) of serializable classes.
-if @kotlinx.serialization.Serializable class ** {
    static **$* *;
}
-keepclassmembers class <2>$<3> {
    kotlinx.serialization.KSerializer serializer(...);
}

# Keep `INSTANCE.serializer()` of serializable objects.
-if @kotlinx.serialization.Serializable class ** {
    public static ** INSTANCE;
}
-keepclassmembers class <1> {
    public static <1> INSTANCE;
    kotlinx.serialization.KSerializer serializer(...);
}

# @Serializable and @Polymorphic are used at runtime for polymorphic serialization.
-keepattributes RuntimeVisibleAnnotations,AnnotationDefault

# Don't print notes about potential mistakes or omissions in the configuration for kotlinx-serialization classes
# See also https://github.com/Kotlin/kotlinx.serialization/issues/1900
-dontnote kotlinx.serialization.**

# Serialization core uses `java.lang.ClassValue` for caching inside these specified classes.
# If there is no `java.lang.ClassValue` (for example, in Android), then R8/ProGuard will print a warning.
# However, since in this case they will not be used, we can disable these warnings
-dontwarn kotlinx.serialization.internal.ClassValueReferences

# disable optimisation for descriptor field because in some versions of ProGuard, optimization generates incorrect bytecode that causes a verification error
# see https://github.com/Kotlin/kotlinx.serialization/issues/2719
-keepclassmembers public class **$$serializer {
    private ** descriptor;
}

# Keep InnerClasses attribute for serialization
-keepattributes InnerClasses

# ====================================================================================
# Data Models
# ====================================================================================
# Keep all data model classes (used for serialization)
-keep class com.momentscience.android.msapidemoapp.model.** { *; }

# Keep data class properties and methods
-keepclassmembers class com.momentscience.android.msapidemoapp.model.** {
    <fields>;
    <methods>;
}

# Keep data class copy() and component functions
-keepclassmembers class com.momentscience.android.msapidemoapp.model.** {
    public ** copy(...);
    public ** component*();
}

# Keep constructors for data classes
-keepclassmembers class com.momentscience.android.msapidemoapp.model.** {
    <init>(...);
}

# ====================================================================================
# Retrofit - Official Rules from Square
# Source: https://github.com/square/retrofit/blob/trunk/retrofit/src/main/resources/META-INF/proguard/retrofit2.pro
# ====================================================================================

# Retrofit does reflection on generic parameters. InnerClasses is required to use Signature and
# EnclosingMethod is required to use InnerClasses.
-keepattributes Signature, InnerClasses, EnclosingMethod

# Retrofit does reflection on method and parameter annotations.
-keepattributes RuntimeVisibleAnnotations, RuntimeVisibleParameterAnnotations

# Keep annotation default values (e.g., retrofit2.http.Field.encoded).
-keepattributes AnnotationDefault

# Retain service method parameters when optimizing.
-keepclassmembers,allowshrinking,allowobfuscation interface * {
    @retrofit2.http.* <methods>;
}

# Ignore annotation used for build tooling.
-dontwarn org.codehaus.mojo.animal_sniffer.IgnoreJRERequirement

# Ignore JSR 305 annotations for embedding nullability information.
-dontwarn javax.annotation.**

# Guarded by a NoClassDefFoundError try/catch and only used when on the classpath.
-dontwarn kotlin.Unit

# Top-level functions that can only be used by Kotlin.
-dontwarn retrofit2.KotlinExtensions
-dontwarn retrofit2.KotlinExtensions$*

# With R8 full mode, it sees no subtypes of Retrofit interfaces since they are created with a Proxy
# and replaces all potential values with null. Explicitly keeping the interfaces prevents this.
-if interface * { @retrofit2.http.* <methods>; }
-keep,allowobfuscation interface <1>

# Keep inherited services.
-if interface * { @retrofit2.http.* <methods>; }
-keep,allowobfuscation interface * extends <1>

# With R8 full mode generic signatures are stripped for classes that are not
# kept. Suspend functions are wrapped in continuations where the type argument
# is used.
-keep,allowoptimization,allowshrinking,allowobfuscation class kotlin.coroutines.Continuation

# R8 full mode strips generic signatures from return types if not kept.
-if interface * { @retrofit2.http.* public *** *(...); }
-keep,allowoptimization,allowshrinking,allowobfuscation class <3>

# With R8 full mode generic signatures are stripped for classes that are not kept.
-keep,allowoptimization,allowshrinking,allowobfuscation class retrofit2.Response

# Keep Converter.Factory implementations
-keep class * extends retrofit2.Converter$Factory { *; }

# Keep Kotlinx Serialization Converter for Retrofit
-keep class com.jakewharton.retrofit2.converter.kotlinx.serialization.** { *; }
-keepclassmembers class com.jakewharton.retrofit2.converter.kotlinx.serialization.** { *; }

# Keep Map and HashMap for @Body parameters
-keep class java.util.Map { *; }
-keep class java.util.HashMap { *; }
-keepclassmembers class java.util.Map { *; }
-keepclassmembers class java.util.HashMap { *; }

# ====================================================================================
# OkHttp
# ====================================================================================
# Keep OkHttp classes
-dontwarn okhttp3.**
-dontwarn okio.**
-dontwarn javax.annotation.**

# Keep OkHttp public API
-keep class okhttp3.** { *; }
-keep interface okhttp3.** { *; }

# Keep MediaType and RequestBody for JSON serialization
-keep class okhttp3.MediaType { *; }
-keep class okhttp3.RequestBody { *; }
-keep class okhttp3.ResponseBody { *; }
-keepclassmembers class okhttp3.MediaType { *; }
-keepclassmembers class okhttp3.RequestBody { *; }
-keepclassmembers class okhttp3.ResponseBody { *; }

# Keep public suffix list for OkHttp
-keepnames class okhttp3.internal.publicsuffix.PublicSuffixDatabase

# OkHttp platform used for SSL
-dontwarn org.conscrypt.**
-dontwarn org.bouncycastle.**
-dontwarn org.openjsse.**

# Keep OkHttp logging interceptor
-keep class okhttp3.logging.HttpLoggingInterceptor { *; }
-keep class okhttp3.logging.HttpLoggingInterceptor$Level { *; }
-keepclassmembers class okhttp3.logging.** { *; }

# ====================================================================================
# Kotlin Coroutines
# ====================================================================================
# Keep coroutines metadata
-keepclassmembernames class kotlinx.** {
    volatile <fields>;
}

# ServiceLoader support for coroutines
-keepnames class kotlinx.coroutines.internal.MainDispatcherFactory {}
-keepnames class kotlinx.coroutines.CoroutineExceptionHandler {}

# Most of volatile fields are updated with AFU and should not be mangled
-keepclassmembers class kotlinx.coroutines.** {
    volatile <fields>;
}

# ====================================================================================
# AndroidX and Jetpack Compose
# ====================================================================================
# Keep Compose runtime classes
-keep class androidx.compose.runtime.** { *; }
-keep class androidx.compose.ui.** { *; }

# Keep Lifecycle components
-keep class androidx.lifecycle.** { *; }

# ====================================================================================
# Coil (Image Loading)
# ====================================================================================
# Keep Coil classes
-keep class coil.** { *; }
-keep interface coil.** { *; }

# ====================================================================================
# General Android Rules
# ====================================================================================
# Keep custom View classes
-keep public class * extends android.view.View {
    public <init>(android.content.Context);
    public <init>(android.content.Context, android.util.AttributeSet);
    public <init>(android.content.Context, android.util.AttributeSet, int);
    public void set*(***);
    *** get*();
}

# Keep Parcelables
-keep class * implements android.os.Parcelable {
    public static final android.os.Parcelable$Creator *;
}

# Keep Enums
-keepclassmembers enum * {
    public static **[] values();
    public static ** valueOf(java.lang.String);
}

# ====================================================================================
# Application-specific Rules
# ====================================================================================
# Keep API service interfaces
-keep interface com.momentscience.android.msapidemoapp.service.api.** { *; }

# Keep all service classes and their methods
-keep class com.momentscience.android.msapidemoapp.service.** { *; }
-keepclassmembers class com.momentscience.android.msapidemoapp.service.** {
    <methods>;
}

# Keep sealed classes and their subclasses (for error handling)
-keep class * extends com.momentscience.android.msapidemoapp.service.OffersError { *; }
-keepclassmembers class * extends com.momentscience.android.msapidemoapp.service.OffersError { *; }

# Keep ViewModel classes
-keep class com.momentscience.android.msapidemoapp.ui.viewmodel.** { *; }

# Keep Repository classes
-keep class com.momentscience.android.msapidemoapp.repository.** { *; }

# ====================================================================================
# Debug Information (Optional - Remove in production if needed)
# ====================================================================================
# Print configuration issues
-printconfiguration build/outputs/mapping/configuration.txt

# Print usage information
-printusage build/outputs/mapping/usage.txt

# ====================================================================================
# R8 Full Mode
# ====================================================================================
# These rules are for R8 full mode optimizations
-allowaccessmodification
-repackageclasses

# Disable specific optimizations that can break Kotlinx Serialization
-optimizations !code/simplification/arithmetic,!code/simplification/cast,!field/*,!class/merging/*
-optimizationpasses 5

# Keep metadata for reflection
-keepattributes Signature
-keepattributes *Annotation*
-keepattributes EnclosingMethod
-keepattributes InnerClasses