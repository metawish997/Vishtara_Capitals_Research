import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, Dimensions, ActivityIndicator } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAppearance } from '@/context/AppearanceContext';

const { height } = Dimensions.get('window');
const THEME_COLOR = '#0a7ea4';
const BG_COLOR = '#F8F9FA';
const CARD_BG = '#FFFFFF';

interface AgreementModalProps {
    visible: boolean;
    onClose: () => void;
    onAccept: () => void;
    isProcessing: boolean;
    user: any;
    selectedPlan: any;
    selectedDuration: any;
    finalPrice: string | number;
    kycData: any;
}

export default function AgreementModal({
    visible,
    onClose,
    onAccept,
    isProcessing,
    user,
    selectedPlan,
    selectedDuration,
    finalPrice,
    kycData
}: AgreementModalProps) {
    const { colorScheme } = useAppearance();
    const isDark = colorScheme === 'dark';
    const [isChecked, setIsChecked] = useState(false);

    const aadhaarNumber = kycData?.kyc_details?.aadhaar || "Pending Verification";
    const panNumber = kycData?.kyc_details?.pan || "Pending Verification";
    const timestamp = new Date().toISOString().replace('T', ' ').split('.')[0];

    const Row = ({ label, value }: { label: string, value: any }) => (
        <View style={styles.tableRow}>
            <Text style={styles.tableLabel}>{label}</Text>
            <Text style={styles.tableValue}>{value}</Text>
        </View>
    );

    return (
        <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.headerLeft}>
                            <Feather name="file-text" size={20} color="#fff" />
                            <Text style={styles.modalTitle}>Institutional Agreement</Text>
                        </View>
                        <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                            <Feather name="x" size={24} color="#fff" />
                        </TouchableOpacity>
                    </View>

                    {/* Scrollable Document */}
                    <ScrollView style={styles.documentScroll} showsVerticalScrollIndicator={true}>
                        <View style={styles.page}>
                            <Text style={styles.docTitle}>CLIENT AGREEMENT AND TERMS AND CONDITIONS</Text>

                            <Text style={styles.sectionTitle}>PART A</Text>
                            <Text style={styles.subTitle}>INTRODUCTION</Text>
                            <Text style={styles.paragraph}>This Agreement is entered into by and between:</Text>
                            <Text style={styles.paragraphIndent}>(a) Research Analyst (hereinafter referred to as the “RA,” “We,” “Our” or “Us”), being a person/entity duly registered with SEBI under Registration No. INH000027779 and in the name of Anujay Chouhan Proprietor of Vishtara Capital Research; and</Text>
                            <Text style={styles.paragraphIndent}>(b) Client / User (hereinafter referred to as “You,” “Your” or “the Client”), being the individual or legal entity subscribing to or availing of the research services provided by the RA.</Text>

                            <Text style={styles.subTitle}>PURPOSE</Text>
                            <Text style={styles.boldText}>Scope and Application</Text>
                            <Text style={styles.paragraphIndent}>These Terms and Conditions (“T&C”) govern the Client’s access to, subscription for, and/or use of the research services provided by the RA (“Services”).</Text>

                            <Text style={styles.subTitle}>Definitions</Text>
                            <Text style={styles.paragraphIndent}>• Client or User: Any person or entity that registers with the RA and agrees to these T&Cs to avail the Services.</Text>
                            <Text style={styles.paragraphIndent}>• Services: Research reports, data, model portfolios, analyses, advisory/research support, and related communications.</Text>

                            <Text style={styles.sectionTitle}>PART B - MANDATORY TERMS</Text>
                            <Text style={styles.paragraph}>By accepting delivery of the research service, the client confirms that he/she has elected to subscribe at his/her sole discretion.</Text>

                            <Text style={styles.sectionTitle}>PART F - CLIENT CONSENT</Text>
                            <Text style={styles.paragraph}>The Client hereby provides consent, confirming that they have thoroughly reviewed and comprehended the terms and conditions of the research analysis services and this entire agreement presented by the Research Analyst. This includes a clear understanding of the fee structure, associated risks, and obligations.</Text>

                            <Text style={styles.sectionTitle}>Customer Details</Text>
                            <View style={styles.table}>
                                <Row label="Name" value={user?.name} />
                                <Row label="E-Mail" value={user?.email} />
                                <Row label="Phone Number" value={user?.phone || user?.mobile} />
                                <Row label="PAN Number" value={panNumber} />
                                <Row label="Aadhaar (Masked)" value={aadhaarNumber} />
                                <Row label="Amount Paid" value={`₹${finalPrice}`} />
                                <Row label="Date of Agreement" value={new Date().toLocaleDateString('en-IN')} />
                                <Row label="Service Plan" value={selectedPlan?.title} />
                                <Row label="Subscription Duration" value={selectedDuration?.label} />
                            </View>

                            <View style={styles.signatureSection}>
                                <Text style={styles.boldText}>DIGITAL CONSENT RECORDED</Text>
                                <Text style={styles.smallText}>I hereby declare that I have read, understood and accepted all terms.</Text>
                                <View style={{ marginTop: 8 }}>
                                    <Text style={styles.smallText}><Text style={styles.boldText}>Signed By:</Text> {user?.name}</Text>
                                    <Text style={styles.smallText}><Text style={styles.boldText}>Aadhaar:</Text> {aadhaarNumber}</Text>
                                    <Text style={styles.smallText}><Text style={styles.boldText}>Timestamp:</Text> {timestamp}</Text>
                                </View>
                            </View>
                        </View>
                    </ScrollView>

                    {/* Footer Actions */}
                    <View style={[styles.footer, { backgroundColor: isDark ? '#040410' : '#FFFFFF', borderTopColor: isDark ? 'rgba(248, 185, 23, 0.15)' : '#e2e8f0' }]}>
                        <TouchableOpacity
                            style={[
                                styles.checkboxContainer,
                                {
                                    backgroundColor: isDark ? 'rgba(255, 255, 255, 0.03)' : '#f8fafc',
                                    borderColor: isDark ? 'rgba(248, 185, 23, 0.15)' : '#e2e8f0'
                                }
                            ]}
                            onPress={() => setIsChecked(!isChecked)}
                            activeOpacity={0.7}
                        >
                            <View style={[
                                styles.checkbox,
                                { borderColor: isDark ? '#B5B2B1' : '#cbd5e1' },
                                isChecked && [styles.checkboxChecked, { backgroundColor: isDark ? '#f8b917' : '#011d52', borderColor: isDark ? '#f8b917' : '#011d52' }]
                            ]}>
                                {isChecked && <Feather name="check" size={14} color="#000000" />}
                            </View>
                            <View style={styles.checkboxLabelContainer}>
                                <Text style={[styles.checkboxLabel, { color: isDark ? '#FFFFFF' : '#082f49' }]}>
                                    I confirm that I have read and I accept the terms of the Research Analyst Agreement.
                                </Text>
                                <Text style={[styles.checkboxSubtext, { color: isDark ? '#f8b917' : '#011d52' }]}>Digital Consent recorded with secure timestamp</Text>
                            </View>
                        </TouchableOpacity>

                        <View style={styles.actionButtons}>
                            <TouchableOpacity onPress={onClose} style={styles.cancelBtn}>
                                <Text style={[styles.cancelBtnText, { color: isDark ? '#B5B2B1' : '#94a3b8' }]}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                disabled={!isChecked || isProcessing}
                                onPress={onAccept}
                                style={[
                                    styles.acceptBtn,
                                    { backgroundColor: isDark ? '#f8b917' : '#011d52' },
                                    (!isChecked || isProcessing) && styles.acceptBtnDisabled
                                ]}
                            >
                                {isProcessing ? (
                                    <ActivityIndicator color="#000000" size="small" />
                                ) : (
                                    <Text style={[styles.acceptBtnText, { color: '#000000' }]}>Sign & Proceed</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    modalContent: {
        width: '100%',
        height: height * 0.7,
        backgroundColor: CARD_BG,
        borderRadius: 16,
        overflow: 'hidden',
        flexDirection: 'column',
    },
    header: {
        backgroundColor: '#082f49', // sky-950
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    headerLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    modalTitle: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginLeft: 8,
    },
    closeBtn: {
        padding: 4,
    },
    documentScroll: {
        flex: 1,
        backgroundColor: '#e2e8f0', // slate-200
        padding: 16,
    },
    page: {
        backgroundColor: '#fff',
        padding: 24,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
        marginBottom: 16,
    },
    docTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        textDecorationLine: 'underline',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        textDecorationLine: 'underline',
        marginTop: 16,
        marginBottom: 8,
        textAlign: 'center',
    },
    subTitle: {
        fontSize: 13,
        fontWeight: 'bold',
        textDecorationLine: 'underline',
        marginTop: 12,
        marginBottom: 6,
    },
    paragraph: {
        fontSize: 12,
        lineHeight: 18,
        marginBottom: 8,
        color: '#333',
    },
    paragraphIndent: {
        fontSize: 12,
        lineHeight: 18,
        marginBottom: 8,
        marginLeft: 16,
        color: '#333',
    },
    boldText: {
        fontSize: 12,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    smallText: {
        fontSize: 11,
        color: '#64748b',
    },
    table: {
        borderWidth: 1,
        borderColor: '#000',
        marginBottom: 24,
        marginTop: 12,
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#000',
    },
    tableLabel: {
        flex: 1,
        padding: 8,
        backgroundColor: '#f8fafc',
        fontWeight: 'bold',
        fontSize: 11,
        borderRightWidth: 1,
        borderRightColor: '#000',
    },
    tableValue: {
        flex: 2,
        padding: 8,
        fontSize: 11,
    },
    signatureSection: {
        borderTopWidth: 1,
        borderTopColor: '#cbd5e1',
        paddingTop: 16,
        marginTop: 16,
    },
    footer: {
        backgroundColor: '#fff',
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#e2e8f0',
    },
    checkboxContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#f8fafc',
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e2e8f0',
        marginBottom: 16,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderWidth: 2,
        borderColor: '#cbd5e1',
        borderRadius: 6,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
        marginTop: 2,
    },
    checkboxChecked: {
        backgroundColor: '#082f49',
        borderColor: '#082f49',
    },
    checkboxLabelContainer: {
        flex: 1,
    },
    checkboxLabel: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#082f49',
        marginBottom: 4,
    },
    checkboxSubtext: {
        fontSize: 10,
        color: '#94a3b8',
        fontWeight: '600',
        textTransform: 'uppercase',
    },
    actionButtons: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        gap: 16,
    },
    cancelBtn: {
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    cancelBtnText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#94a3b8',
        textTransform: 'uppercase',
    },
    acceptBtn: {
        backgroundColor: '#082f49',
        paddingVertical: 14,
        paddingHorizontal: 32,
        borderRadius: 12,
    },
    acceptBtnDisabled: {
        opacity: 0.5,
    },
    acceptBtnText: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
});
